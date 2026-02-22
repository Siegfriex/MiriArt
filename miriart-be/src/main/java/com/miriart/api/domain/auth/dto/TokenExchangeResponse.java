package com.miriart.api.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * POST /api/auth/token 응답 DTO
 */
@Getter
@Builder
public class TokenExchangeResponse {

    private String accessToken;
    private int expiresIn;
    private String userId;
    private boolean needsProfile;
    private String provider;
}
