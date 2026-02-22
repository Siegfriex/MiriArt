package com.miriart.api.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

/**
 * GET /api/users/me/plan 응답 DTO. 플랜명·월 한도·이번 달 사용량·잔여·청구 기간 시작일.
 *
 * <p>연계: {@link UserService#getPlanInfo}에서 usedThisMonth( AnalysisService에서 조회)와 PlanType monthlyLimit으로 remaining 계산 후 반환.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class UserPlanResponse {

    private String plan;
    private int monthlyLimit;
    private long usedThisMonth;
    private long remaining;
    private LocalDate billingPeriodStart;
}
