package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.ReputationLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReputationLedgerRepository extends JpaRepository<ReputationLedger, Long> {

    Page<ReputationLedger> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
