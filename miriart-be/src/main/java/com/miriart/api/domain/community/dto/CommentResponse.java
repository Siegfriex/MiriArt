package com.miriart.api.domain.community.dto;

import com.miriart.api.domain.community.entity.Comment;
import lombok.Builder;
import lombok.Getter;

/**
 * 댓글 응답 DTO. FE commentSchema (community.ts:75-82) 매핑.
 */
@Getter
@Builder
public class CommentResponse {

    private String id;
    private String parentType;
    private String parentId;
    private PersonaResponse persona;
    private String content;
    private String createdAt;

    public static CommentResponse from(Comment c) {
        return CommentResponse.builder()
                .id(String.valueOf(c.getId()))
                .parentType(c.getParentType().name().toLowerCase())
                .parentId(String.valueOf(c.getParentId()))
                .persona(PersonaResponse.from(c.getPersona()))
                .content(c.getContent())
                .createdAt(c.getCreatedAt().toString())
                .build();
    }
}
