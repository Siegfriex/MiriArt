package com.miriart.api.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 댓글 작성 요청 DTO. POST /api/comments.
 * FE는 parentType을 소문자("post"/"answer")로 전송.
 */
public record CreateCommentRequest(
        @NotBlank String parentType,
        @NotNull Long parentId,
        @NotBlank @Size(max = 500) String content
) {}
