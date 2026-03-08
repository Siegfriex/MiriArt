package com.miriart.api.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 댓글 작성 요청 DTO.
 *
 * @param parentType 부모 타입 (post / answer)
 * @param parentId   부모 ID
 * @param content    댓글 내용
 */
public record CreateCommentRequest(
        @NotBlank String parentType,
        @NotNull Long parentId,
        @NotBlank String content
) {}
