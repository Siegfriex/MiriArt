package com.miriart.api.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI(Swagger) 문서 설정. 제목·설명·버전 및 JWT Bearer SecurityScheme 등록.
 * Swagger UI에서 Authorize로 Bearer 토큰 입력 후 인증 필요 API 호출 가능.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MiriArt API")
                        .description("미대 입시 AI 코칭·커뮤니티 백엔드 API")
                        .version("1.0"))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Access Token (POST /api/auth/token 또는 /api/auth/refresh로 발급)")))
                .security(List.of(new SecurityRequirement().addList(SECURITY_SCHEME_NAME)));
    }
}
