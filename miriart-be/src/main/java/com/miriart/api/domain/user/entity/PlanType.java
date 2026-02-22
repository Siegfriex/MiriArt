package com.miriart.api.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 구독 플랜 타입. FREE(2회/월)·BASIC(10)·PREMIUM(무제한). 월별 분석 크레딧 한도.
 *
 * <p>연계: {@link User} planType. {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 monthlyLimit으로 크레딧 체크.</p>
 *
 * @author MiriArt Team
 */
@Getter
@RequiredArgsConstructor
public enum PlanType {
    FREE(2),
    BASIC(10),
    PREMIUM(99999);

    private final int monthlyLimit;
}
