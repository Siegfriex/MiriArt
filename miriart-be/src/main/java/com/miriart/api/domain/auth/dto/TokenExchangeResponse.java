package com.miriart.api.domain.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * POST /api/auth/token 응답 DTO. Access 토큰·만료초·userId·needsProfile·provider. Refresh는 httpOnly 쿠키로 전달.
 *
 * <p>연계: {@link OAuth2TokenExchangeService#exchange} 반환 → FE가 accessToken으로 API 호출, needsProfile로 프로필 완료 여부 판단.</p>
 *
 * @author MiriArt Team
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
