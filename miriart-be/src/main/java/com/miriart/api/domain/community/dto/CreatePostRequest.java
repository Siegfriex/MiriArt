package com.miriart.api.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * 게시글 작성 요청 DTO. FE createPostRequestSchema (community.ts:46-56) 매칭.
 */
public record CreatePostRequest(
        @NotBlank String type,
        @NotBlank @Size(max = 100) String title,
        @NotBlank @Size(max = 10000) String content,
        @Size(max = 10) List<String> imageUrls,
        @Size(max = 10) List<String> tags,
        String gradeScope,
        String domainScope,
        Boolean isAnonymous,
        Integer deadlineHours
) {}
