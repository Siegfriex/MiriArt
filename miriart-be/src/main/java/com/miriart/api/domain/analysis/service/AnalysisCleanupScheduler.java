package com.miriart.api.domain.analysis.service;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.entity.AnalysisStatus;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * PENDING 상태 분석 자동 정리. 30분 초과 PENDING → FAILED 전환.
 * FastAPI 장애/타임아웃 시 영구 PENDING 방지.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AnalysisCleanupScheduler {

    private static final int PENDING_TIMEOUT_MINUTES = 30;

    private final AnalysisRepository analysisRepository;

    @Scheduled(fixedRate = 300_000) // 5분마다
    @Transactional
    public void cleanupStalePending() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(PENDING_TIMEOUT_MINUTES);
        List<Analysis> staleList = analysisRepository
                .findByStatusAndCreatedAtBefore(AnalysisStatus.PENDING, threshold);

        if (staleList.isEmpty()) return;

        for (Analysis analysis : staleList) {
            analysis.fail();
            log.warn("PENDING 타임아웃 → FAILED - analysisId: {}, createdAt: {}",
                    analysis.getId(), analysis.getCreatedAt());
        }

        log.info("PENDING 정리 완료 - {}건 FAILED 전환", staleList.size());
    }
}
