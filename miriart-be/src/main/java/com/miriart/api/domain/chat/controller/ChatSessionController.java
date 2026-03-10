package com.miriart.api.domain.chat.controller;

import com.miriart.api.domain.chat.dto.ChatSessionResponse;
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

/**
 * 채팅 세션 API 컨트롤러. GET /api/chat/sessions — 세션 목록 조회.
 *
 * <p>연계: {@link ChatSessionService}에서 목록 조회. 인증된 사용자만 자신의 세션 접근 가능.</p>
 *
 * @author MiriArt Team
 */
@Tag(name = "채팅 세션", description = "채팅 세션 관리")
@RestController
@RequestMapping("/api/chat/sessions")
@RequiredArgsConstructor
public class ChatSessionController {

    private final ChatSessionService chatSessionService;

    @Operation(summary = "채팅 세션 목록 조회")
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
}
