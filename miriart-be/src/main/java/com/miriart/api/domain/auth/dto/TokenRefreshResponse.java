package com.miriart.api.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * POST /api/auth/refresh 응답 DTO. 새 Access 토큰·만료 초.
 *
 * <p>연계: {@link TokenRefreshService#refresh} 반환 → FE가 새 accessToken으로 API 재호출.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class TokenRefreshResponse {

    private String accessToken;
    private int expiresIn;
}
