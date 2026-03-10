package com.miriart.api.domain.community.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * 게시글 작성 요청 DTO. FE createPostRequestSchema (community.ts:46-56) 매칭.
 */
@Schema(description = "게시글 작성 요청")
public record CreatePostRequest(
        @Schema(description = "게시글 유형: free | qna", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank String type,
        @Schema(description = "제목", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 100)
        @NotBlank @Size(max = 100) String title,
        @Schema(description = "본문", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 10000)
        @NotBlank @Size(max = 10000) String content,
        @Schema(description = "이미지 URL 목록 (최대 10개)")
        @Size(max = 10) List<String> imageUrls,
        @Schema(description = "태그 목록 (최대 10개)")
        @Size(max = 10) List<String> tags,
        @Schema(description = "학년 스코프 (QnA 필터용)")
        String gradeScope,
        @Schema(description = "도메인 스코프 (QnA 필터용)")
        String domainScope,
        @Schema(description = "익명 여부")
        Boolean isAnonymous,
        @Schema(description = "QnA 마감 시간(시간 단위)")
        Integer deadlineHours
) {}
