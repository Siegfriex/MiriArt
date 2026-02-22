package com.miriart.api.domain.ai.controller;

import com.miriart.api.domain.ai.dto.ChatRequest;
import com.miriart.api.domain.ai.dto.ChatResponse;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.miriart.api.global.response.ApiResponse;
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
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class AiChatController {

    private final AiProxyService aiProxyService;

    /**
     * AI 멘토에게 메시지 전송
     * FE 현 ApiService.chat() 마이그레이션 대상 (경로 동일, Authorization 헤더 추가)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid ChatRequest request) {
        ChatResponse response = aiProxyService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
