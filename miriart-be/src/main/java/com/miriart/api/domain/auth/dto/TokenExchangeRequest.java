package com.miriart.api.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "OAuth 리다이렉트 후 FE가 받은 1회용 인가 코드로 JWT 발급 요청")
@Getter
@NoArgsConstructor
public class TokenExchangeRequest {

    @Schema(description = "OAuth 리다이렉트 후 받은 1회용 code", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "인가 코드는 필수입니다")
    private String code;
}
