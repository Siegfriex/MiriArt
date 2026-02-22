package com.miriart.api.domain.community.entity;

/**
 * 댓글 부모 타입. POST(게시글) / ANSWER(답변). Comment 엔티티 parentType 필드.
 *
 * <p>연계: {@link Comment}, {@link CommentRepository#findByParentTypeAndParentIdOrderByCreatedAtAsc}.</p>
 *
 * @author MiriArt Team
 */
public enum CommentParentType {
    POST,
    ANSWER
}
