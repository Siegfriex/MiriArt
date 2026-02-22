package com.miriart.api.domain.analysis.entity;

/**
 * 분석 상태. PENDING(대기) → COMPLETED 또는 FAILED.
 *
 * <p>연계: {@link Analysis} 엔티티 status 필드. FastAPI 호출 전 PENDING, 성공 시 COMPLETED, 실패 시 FAILED.</p>
 *
 * @author MiriArt Team
 */
public enum AnalysisStatus {
    PENDING,
    COMPLETED,
    FAILED
}
