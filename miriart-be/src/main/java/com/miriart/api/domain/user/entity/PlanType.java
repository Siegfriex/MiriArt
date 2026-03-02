package com.miriart.api.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 구독 플랜 타입. FREE(5회/월)·BASIC(10)·PREMIUM(무제한). 월별 분석 크레딧 한도.
 * <p>P1: 온보딩 전(needsProfile=true)에만 한도 적용. 온보딩 후(needsProfile=false)는 한도 체크 스킵.</p>
 *
 * <p>연계: {@link User} planType. {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 monthlyLimit으로 크레딧 체크.</p>
 *
 * @author MiriArt Team
 */
@Getter
@RequiredArgsConstructor
public enum PlanType {
    FREE(5),
    BASIC(10),
    PREMIUM(99999);

    private final int monthlyLimit;
}
