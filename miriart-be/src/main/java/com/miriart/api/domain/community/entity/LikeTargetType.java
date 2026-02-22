package com.miriart.api.domain.community.entity;

/**
 * 좋아요 대상 타입. POST / ANSWER / COMMENT. Like 엔티티 targetType 필드.
 *
 * <p>연계: {@link Like}, {@link LikeRepository#findByUserIdAndTargetTypeAndTargetId}, countByTargetTypeAndTargetId.</p>
 *
 * @author MiriArt Team
 */
public enum LikeTargetType {
    POST,
    ANSWER,
    COMMENT
}
