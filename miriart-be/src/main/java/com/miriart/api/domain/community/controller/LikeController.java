package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.LikeToggleRequest;
import com.miriart.api.domain.community.dto.LikeToggleResponse;
import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.service.LikeCommandService;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 좋아요 토글 API. POST /api/likes/toggle (인증 필요).
 */
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeCommandService likeCommandService;

    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<LikeToggleResponse>> toggle(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid LikeToggleRequest req) {
        LikeTargetType type;
        try {
            type = LikeTargetType.valueOf(req.targetType());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        LikeToggleResponse response = likeCommandService.toggleLike(userId, type, req.targetId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
