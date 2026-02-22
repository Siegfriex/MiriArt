package com.miriart.api.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * POST /api/auth/refresh 응답 DTO
 */
@Getter
@Builder
public class TokenRefreshResponse {

    private String accessToken;
    private int expiresIn;
}
