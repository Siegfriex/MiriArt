package com.miriart.api.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

/**
 * GET /api/users/me/plan 응답 DTO
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
