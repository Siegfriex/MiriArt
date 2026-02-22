package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.ReputationLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 평판 원장 JPA 리포지토리. 사용자별 이력 페이지 조회(최신순).
 *
 * <p>연계: 평판 포인트 지급/차감 시 원장 저장, 마이페이지에서 이력 조회 시 사용.</p>
 *
 * @author MiriArt Team
 */
public interface ReputationLedgerRepository extends JpaRepository<ReputationLedger, Long> {

    Page<ReputationLedger> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
