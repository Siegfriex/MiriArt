package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Like;
import com.miriart.api.domain.community.entity.LikeTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 좋아요 JPA 리포지토리. 사용자·대상별 단건 조회, 존재 여부, 대상별 개수.
 *
 * <p>연계: 좋아요 토글·중복 방지(ErrorCode.LIKE_ALREADY_EXISTS)·게시글/답변 likeCount 집계 시 사용.</p>
 *
 * @author MiriArt Team
 */
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndTargetTypeAndTargetId(Long userId, LikeTargetType targetType, Long targetId);

    boolean existsByUserIdAndTargetTypeAndTargetId(Long userId, LikeTargetType targetType, Long targetId);

    long countByTargetTypeAndTargetId(LikeTargetType targetType, Long targetId);
}
