package com.miriart.api.domain.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 구독 플랜 타입
 */
@Getter
@RequiredArgsConstructor
public enum PlanType {
    FREE(2),
    BASIC(10),
    PREMIUM(99999);

    private final int monthlyLimit;
}
