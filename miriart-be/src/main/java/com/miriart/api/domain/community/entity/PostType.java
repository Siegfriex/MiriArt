package com.miriart.api.domain.community.entity;

/**
 * 게시글 유형. FREE(자유글) / QNA(질문). Post 엔티티 type 필드.
 *
 * <p>연계: {@link Post}, {@link PostRepository#findByTypeAndStatus}.</p>
 *
 * @author MiriArt Team
 */
public enum PostType {
    FREE,
    QNA
}
