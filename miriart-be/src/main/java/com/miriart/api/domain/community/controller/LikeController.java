package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.LikeToggleRequest;
import com.miriart.api.domain.community.dto.LikeToggleResponse;
import com.miriart.api.domain.community.service.LikeCommandService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 좋아요 토글 API. POST /api/likes/toggle (인증 필요).
 */
@Tag(name = "커뮤니티", description = "게시글·답변·좋아요 API")
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeCommandService likeCommandService;

    @Operation(summary = "좋아요 토글")
    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<LikeToggleResponse>> toggle(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid LikeToggleRequest req) {
        LikeToggleResponse response = likeCommandService.toggleLike(userId, req.targetType(), req.targetId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
