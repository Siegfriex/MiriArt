package com.miriart.api.domain.community.dto;

/**
 * 좋아요 토글 응답 DTO. FE toggleLikeResponseSchema 매칭.
 */
public record LikeToggleResponse(
        boolean liked,
        int likeCount
) {}
