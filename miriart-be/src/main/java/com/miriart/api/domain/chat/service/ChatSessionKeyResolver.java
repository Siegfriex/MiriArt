package com.miriart.api.domain.chat.service;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.chat.entity.ChatSession;
import com.miriart.api.domain.chat.repository.ChatSessionRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * FE에서 전달된 rawSessionId를 sessionKey(UUID)로 정규화.
 * analysisId → sessionKey 하위 호환 로직이 이 클래스에 국소화됨.
 *
 * <p>내부 구조 (CTO 리뷰 3.1 반영):</p>
 * <ul>
 *   <li>{@link #classifyInput} — 키 파싱/분류 (순수 함수, 부수효과 없음)</li>
 *   <li>{@link #findOrCreateSession} — 엔티티 조회/생성 (DB 접근)</li>
 * </ul>
 *
 * <p>연계: {@link com.miriart.api.domain.ai.controller.AiChatController}에서 컨트롤러 레벨 1회 호출.
 * 이후 도메인 전체는 sessionKey(UUID)만 사용.</p>
 *
 * @author MiriArt Team
 */
@Component
@RequiredArgsConstructor
public class ChatSessionKeyResolver {

    private final ChatSessionRepository chatSessionRepository;
    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;

    public record Result(String sessionKey, ChatSession chatSession) {}

    // ── 키 분류 ────────────────────────────────────────────────────────────────

    enum InputType { NEW_SESSION, ANALYSIS_ID, SESSION_KEY }

    record ClassifiedInput(InputType type, Long analysisId, String sessionKey) {
        static ClassifiedInput newSession() {
            return new ClassifiedInput(InputType.NEW_SESSION, null, null);
        }
        static ClassifiedInput ofAnalysisId(Long id) {
            return new ClassifiedInput(InputType.ANALYSIS_ID, id, null);
        }
        static ClassifiedInput ofSessionKey(String key) {
            return new ClassifiedInput(InputType.SESSION_KEY, null, key);
        }
    }

    /**
     * rawSessionId를 타입별로 분류. 순수 파싱, DB 접근 없음.
     * - null / blank / "new-session" → NEW_SESSION
     * - 숫자 → ANALYSIS_ID (하위 호환)
     * - 그 외 문자열 → SESSION_KEY (UUID)
     */
    ClassifiedInput classifyInput(String rawSessionId) {
        if (rawSessionId == null || rawSessionId.isBlank() || "new-session".equals(rawSessionId)) {
            return ClassifiedInput.newSession();
        }
        try {
            Long analysisId = Long.parseLong(rawSessionId);
            return ClassifiedInput.ofAnalysisId(analysisId);
        } catch (NumberFormatException ignored) {
            // UUID 형식
        }
        return ClassifiedInput.ofSessionKey(rawSessionId);
    }

    // ── 엔티티 조회/생성 ──────────────────────────────────────────────────────

    /**
     * FE에서 전달된 rawSessionId를 정규화하여 ChatSession을 반환.
     * classifyInput()으로 키 분류 → findOrCreateSession()으로 엔티티 획득.
     */
    public Result resolve(Long userId, String rawSessionId) {
        ClassifiedInput input = classifyInput(rawSessionId);
        ChatSession session = findOrCreateSession(userId, input);
        return new Result(session.getSessionKey(), session);
    }

    private ChatSession findOrCreateSession(Long userId, ClassifiedInput input) {
        return switch (input.type()) {
            case NEW_SESSION -> createNewSession(userId, null);
            case ANALYSIS_ID -> chatSessionRepository
                    .findByUserIdAndAnalysisId(userId, input.analysisId())
                    .orElseGet(() -> createSessionFromAnalysis(userId, input.analysisId()));
            case SESSION_KEY -> chatSessionRepository
                    .findByUserIdAndSessionKey(userId, input.sessionKey())
                    .orElseGet(() -> createNewSession(userId, null));
        };
    }

    // ── 세션 생성 ─────────────────────────────────────────────────────────────

    private ChatSession createNewSession(Long userId, Analysis analysis) {
        User user = userRepository.getReferenceById(userId);
        String title = (analysis != null)
                ? buildTitleFromAnalysis(analysis)
                : generateNewSessionTitle(userId);
        return chatSessionRepository.save(
                ChatSession.builder()
                        .user(user)
                        .analysis(analysis)
                        .sessionKey(UUID.randomUUID().toString())
                        .title(title)
                        .build()
        );
    }

    private ChatSession createSessionFromAnalysis(Long userId, Long analysisId) {
        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANALYSIS_NOT_FOUND));
        return createNewSession(userId, analysis);
    }

    // ── 타이틀 규칙 ───────────────────────────────────────────────────────────
    // 규칙 문서: docs/FEATURE_SPEC_CHAT_SESSION_API.md §3.4
    //  - 분석 기반: "{grade}등급 분석 채팅" (grade null → "분석 채팅")
    //  - 자유 채팅: "새 채팅 {사용자별 세션 수 + 1}"

    private String buildTitleFromAnalysis(Analysis analysis) {
        if (analysis.getGrade() != null) {
            return analysis.getGrade().name() + "등급 분석 채팅";
        }
        return "분석 채팅";
    }

    private String generateNewSessionTitle(Long userId) {
        long count = chatSessionRepository.countByUserId(userId);
        return "새 채팅 " + (count + 1);
    }
}
