package com.miriart.api.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * POST /api/auth/token 요청 DTO
 */
@Getter
@NoArgsConstructor
public class TokenExchangeRequest {

    @NotBlank(message = "인가 코드는 필수입니다")
    private String code;
}
