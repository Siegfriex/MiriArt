package com.miriart.api.domain.analysis.repository;

import com.miriart.api.domain.analysis.entity.AnalysisUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 분석 사용량 로그 JPA 리포지토리. 월별 사용 횟수 집계.
 *
 * <p>연계: {@link AnalysisService#startAnalysis}에서 크레딧 한도 체크·로그 저장 시 사용.</p>
 *
 * @author MiriArt Team
 */
public interface AnalysisUsageLogRepository extends JpaRepository<AnalysisUsageLog, Long> {

    long countByUserIdAndBillingYearMonth(Long userId, String billingYearMonth);
}
