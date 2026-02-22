package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Like;
import com.miriart.api.domain.community.entity.LikeTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndTargetTypeAndTargetId(Long userId, LikeTargetType targetType, Long targetId);

    boolean existsByUserIdAndTargetTypeAndTargetId(Long userId, LikeTargetType targetType, Long targetId);

    long countByTargetTypeAndTargetId(LikeTargetType targetType, Long targetId);
}
