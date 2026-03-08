package com.miriart.api.domain.community.dto;

import java.util.List;

/**
 * 피드 페이지 응답 DTO. FE postsResponseSchema (community.ts:38-41) 매핑.
 */
public record PostsFeedPageResponse(
        List<PostFeedResponse> posts,
        String nextCursor
) {}
