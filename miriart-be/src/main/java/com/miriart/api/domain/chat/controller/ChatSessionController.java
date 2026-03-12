package com.miriart.api.domain.chat.controller;

import com.miriart.api.domain.chat.dto.ChatMessageDto;
import com.miriart.api.domain.chat.dto.ChatSessionResponse;
import com.miriart.api.domain.chat.service.ChatHistoryService;
import com.miriart.api.domain.chat.service.ChatSessionService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 채팅 세션 API 컨트롤러.
 *
 * <ul>
 *   <li>GET /api/chat/sessions — 세션 목록 (페이징, grade 필터)</li>
 *   <li>GET /api/chat/sessions?analysisId=xxx — analysisId 기반 세션 조회/생성</li>
 *   <li>GET /api/chat/sessions/{sessionKey} — sessionKey 기반 단건 조회</li>
 *   <li>GET /api/chat/sessions/{sessionKey}/messages — Redis 히스토리 조회</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Tag(name = "채팅 세션", description = "채팅 세션 관리")
@RestController
@RequestMapping("/api/chat/sessions")
@RequiredArgsConstructor
public class ChatSessionController {

    private final ChatSessionService chatSessionService;
    private final ChatHistoryService chatHistoryService;

    @Operation(summary = "분석 기반 세션 조회/생성",
            description = "userId+analysisId로 세션 조회. 없으면 새로 생성. analysisId는 Long.")
    @GetMapping(params = "analysisId")
    public ResponseEntity<ApiResponse<ChatSessionResponse>> getOrCreateByAnalysis(
            @AuthenticationPrincipal Long userId,
            @RequestParam Long analysisId) {
        return ResponseEntity.ok(ApiResponse.success(
                chatSessionService.getOrCreateByAnalysis(userId, analysisId)));
    }

    @Operation(summary = "채팅 세션 목록 조회",
            description = "grade, totalScore, fixScope는 Analysis와 연동된 세션(analysisId가 있는 경우)에서만 채워지며, "
                    + "일반 세션(analysisId null)이거나 분석이 PENDING/FAILED이면 null일 수 있습니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ChatSessionResponse>>> getSessionList(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String grade) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ChatSessionResponse> sessions = chatSessionService.getSessionList(userId, grade, pageable);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @Operation(summary = "세션 단건 조회 (sessionKey)",
            description = "sessionKey(UUID)로 세션 메타데이터 조회. 없으면 CS001. "
                    + "grade, totalScore, fixScope는 Analysis와 연동된 세션(analysisId가 있는 경우)에서만 채워지며, "
                    + "일반 세션(analysisId null)이거나 분석이 PENDING/FAILED이면 null일 수 있습니다.")
    @GetMapping("/{sessionKey}")
    public ResponseEntity<ApiResponse<ChatSessionResponse>> getBySessionKey(
            @AuthenticationPrincipal Long userId,
            @PathVariable String sessionKey) {
        return ResponseEntity.ok(ApiResponse.success(
                chatSessionService.getBySessionKey(userId, sessionKey)));
    }

    @Operation(summary = "세션 메시지 히스토리 조회",
            description = "Redis에서 세션 히스토리를 가져와 ChatMessageDto 리스트로 반환.")
    @GetMapping("/{sessionKey}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getMessages(
            @AuthenticationPrincipal Long userId,
            @PathVariable String sessionKey,
            @RequestParam(defaultValue = "100") int limit) {
        // 세션 존재 여부 확인 (없으면 CS001)
        chatSessionService.getBySessionKey(userId, sessionKey);
        List<ChatMessageDto> messages = chatHistoryService.getRecentMessages(sessionKey, limit);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }
}
