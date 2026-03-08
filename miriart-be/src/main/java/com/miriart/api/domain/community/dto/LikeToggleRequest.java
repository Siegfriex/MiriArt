package com.miriart.api.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 좋아요 토글 요청 DTO. FE toggleLikeRequestSchema 매칭.
 * targetType: "POST" | "ANSWER" (대문자, FE에서 변환).
 */
public record LikeToggleRequest(
        @NotBlank String targetType,
        @NotNull Long targetId
) {}
