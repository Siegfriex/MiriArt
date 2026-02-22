package com.miriart.api.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * POST /api/auth/token 요청 DTO. FE가 OAuth 콜백에서 받은 1회용 code.
 *
 * <p>연계: FE → {@link AuthController#exchangeToken} → {@link OAuth2TokenExchangeService#exchange}.</p>
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
public class TokenExchangeRequest {

    @NotBlank(message = "인가 코드는 필수입니다")
    private String code;
}
