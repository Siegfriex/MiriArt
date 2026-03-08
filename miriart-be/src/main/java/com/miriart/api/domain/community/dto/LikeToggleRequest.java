package com.miriart.api.domain.community.dto;

import com.miriart.api.domain.community.entity.LikeTargetType;
import jakarta.validation.constraints.NotNull;

/**
 * 좋아요 토글 요청 DTO. FE toggleLikeRequestSchema 매칭.
 * targetType: POST | ANSWER (enum 직접 바인딩, Spring이 자동 변환).
 */
public record LikeToggleRequest(
        @NotNull LikeTargetType targetType,
        @NotNull Long targetId
) {}
