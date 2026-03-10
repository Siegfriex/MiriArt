package com.miriart.api.domain.ai.controller;

import com.miriart.api.domain.ai.dto.ChatRequest;
import com.miriart.api.domain.ai.dto.ChatResponse;
import com.miriart.api.domain.chat.service.ChatSessionKeyResolver;
import com.miriart.api.domain.chat.service.ChatSessionService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * AI 채팅 API 컨트롤러. POST /api/chat — AI 멘토 채팅 메시지 전송.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>FE가 Authorization Bearer + {@link ChatRequest} (message, history, stickyContext 등) 전송</li>
 *   <li>{@link AiProxyService#chat} 호출 → FastAPI /internal/ai/chat → Redis 세션 업데이트</li>
 *   <li>응답 {@link ChatResponse} (text, quickReplies, sessionId)를 {@link com.miriart.api.global.response.ApiResponse}로 래핑 반환</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Tag(name = "AI 채팅", description = "AI 멘토 채팅")
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class AiChatController {

    private final ChatSessionKeyResolver chatSessionKeyResolver;
    private final ChatSessionService chatSessionService;

    /**
     * AI 멘토에게 메시지 전송.
     * ChatSessionKeyResolver가 rawSessionId(analysisId/UUID/null)를 sessionKey로 정규화.
     * ChatSessionService가 AI 호출 + DB 메타 업데이트.
     */
    @Operation(summary = "AI 멘토 채팅 메시지 전송")
    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid ChatRequest request) {

        // 1. ID 정규화: analysisId|UUID|null|"new-session" → sessionKey
        ChatSessionKeyResolver.Result resolved =
                chatSessionKeyResolver.resolve(userId, request.getSessionId());
        request.setSessionId(resolved.sessionKey());

        // 2. AI 호출 + DB 메타 업데이트
        ChatResponse response = chatSessionService.chat(userId, request, resolved.chatSession());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
