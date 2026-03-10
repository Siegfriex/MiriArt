package com.miriart.api.domain.community.dto;

import com.miriart.api.domain.community.entity.LikeTargetType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * 좋아요 토글 요청 DTO. FE toggleLikeRequestSchema 매칭.
 * targetType: POST | ANSWER (enum 직접 바인딩, Spring이 자동 변환).
 */
@Schema(description = "좋아요 토글 요청")
public record LikeToggleRequest(
        @Schema(description = "대상 타입: POST(게시글) | ANSWER(답변)", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull LikeTargetType targetType,
        @Schema(description = "대상 ID (게시글 또는 답변 ID)", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull Long targetId
) {}
