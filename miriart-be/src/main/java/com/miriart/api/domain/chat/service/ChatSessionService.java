package com.miriart.api.domain.chat.service;

import com.miriart.api.domain.ai.dto.ChatRequest;
import com.miriart.api.domain.ai.dto.ChatResponse;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.entity.AnalysisGrade;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.chat.dto.ChatSessionResponse;
import com.miriart.api.domain.chat.entity.ChatRole;
import com.miriart.api.domain.chat.entity.ChatSession;
import com.miriart.api.domain.chat.repository.ChatSessionRepository;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * 채팅 세션 도메인 서비스. DB 메타데이터 관리 + AiProxyService 래핑.
 *
 * <p>도메인 경계:</p>
 * <ul>
 *   <li>{@link AiProxyService} — AI 호출 + Redis 히스토리 저장 (변경 없음)</li>
 *   <li>{@code ChatSessionService} — 세션 DB 메타 (목록/단건/삭제) + AiProxyService 래핑</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatSessionService {

    private final ChatSessionRepository chatSessionRepository;
    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final AiProxyService aiProxyService;

    /**
     * [Phase 1] 채팅 메시지 전송. AI 호출 후 DB 메타데이터 업데이트.
     */
    @Transactional
    public ChatResponse chat(Long userId, ChatRequest request, ChatSession session) {
        // 1. AI 호출 (기존 AiProxyService 그대로 — Redis 히스토리도 여기서 저장됨)
        ChatResponse response = aiProxyService.chat(request);

        // 2. DB 메타데이터 업데이트
        session.applyMessage(ChatRole.USER, request.getMessage());
        session.applyMessage(ChatRole.MODEL, response.getText());
        chatSessionRepository.save(session);

        return response;
    }

    /**
     * [Phase 1] 세션 목록 조회. grade 필터 옵션.
     */
    public Page<ChatSessionResponse> getSessionList(Long userId, String grade, Pageable pageable) {
        AnalysisGrade analysisGrade = null;
        if (grade != null && !grade.isBlank()) {
            try {
                analysisGrade = AnalysisGrade.valueOf(grade);
            } catch (IllegalArgumentException ignored) {
                // 잘못된 grade 값 → 필터 없이 전체 반환
            }
        }

        Page<ChatSession> sessions = (analysisGrade != null)
                ? chatSessionRepository.findByUserIdAndGrade(userId, analysisGrade, pageable)
                : chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(userId, pageable);

        return sessions.map(this::toResponse);
    }

    /**
     * analysisId 기반 세션 조회 또는 생성.
     * FE가 분석 결과 → 멘토 질문 시 호출.
     */
    @Transactional
    public ChatSessionResponse getOrCreateByAnalysis(Long userId, Long analysisId) {
        ChatSession session = chatSessionRepository.findByUserIdAndAnalysisId(userId, analysisId)
                .orElseGet(() -> {
                    Analysis analysis = analysisRepository.findById(analysisId)
                            .orElseThrow(() -> new BusinessException(ErrorCode.ANALYSIS_NOT_FOUND));
                    String title = (analysis.getGrade() != null)
                            ? analysis.getGrade().name() + "등급 분석 채팅"
                            : "분석 채팅";
                    return chatSessionRepository.save(ChatSession.builder()
                            .user(userRepository.getReferenceById(userId))
                            .analysis(analysis)
                            .sessionKey(UUID.randomUUID().toString())
                            .modelType("CHAT_PRO")
                            .title(title)
                            .build());
                });
        return toResponse(session);
    }

    /**
     * sessionKey 기반 세션 단건 조회. 없으면 CS001 예외.
     */
    public ChatSessionResponse getBySessionKey(Long userId, String sessionKey) {
        ChatSession session = chatSessionRepository.findByUserIdAndSessionKey(userId, sessionKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.CHAT_SESSION_NOT_FOUND));
        return toResponse(session);
    }

    private ChatSessionResponse toResponse(ChatSession cs) {
        Analysis a = cs.getAnalysis();
        return ChatSessionResponse.builder()
                .id(cs.getId())
                .sessionKey(cs.getSessionKey())
                .analysisId(a != null ? a.getId() : null)
                .modelType(cs.getModelType())
                .title(cs.getTitle())
                .lastMessage(cs.getLastMessage())
                .messageCount(cs.getMessageCount())
                .grade(a != null && a.getGrade() != null ? a.getGrade().name() : null)
                .totalScore(a != null ? a.getTotalScore() : null)
                .fixScope(a != null && a.getFixScope() != null ? a.getFixScope().name() : null)
                .createdAt(cs.getCreatedAt())
                .updatedAt(cs.getUpdatedAt())
                .build();
    }
}
