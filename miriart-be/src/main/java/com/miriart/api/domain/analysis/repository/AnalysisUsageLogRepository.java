package com.miriart.api.domain.analysis.repository;

import com.miriart.api.domain.analysis.entity.AnalysisUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisUsageLogRepository extends JpaRepository<AnalysisUsageLog, Long> {

    long countByUserIdAndBillingYearMonth(Long userId, String billingYearMonth);
}
