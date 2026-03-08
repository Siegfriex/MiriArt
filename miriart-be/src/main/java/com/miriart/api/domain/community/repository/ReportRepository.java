package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 신고 JPA 리포지토리. 중복 신고 방지용 조회.
 */
public interface ReportRepository extends JpaRepository<Report, Long> {

    Optional<Report> findByUserIdAndTargetTypeAndTargetId(
            Long userId, LikeTargetType targetType, Long targetId);
}
