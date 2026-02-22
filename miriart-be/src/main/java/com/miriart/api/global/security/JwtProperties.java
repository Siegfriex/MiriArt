package com.miriart.api.global.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 설정 바인딩 (application.yml의 miriart.jwt.* 키)
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "miriart.jwt")
public class JwtProperties {

    private Secret secret = new Secret();
    private long accessExpirationMs = 900000;       // 15분
    private long refreshExpirationMs = 604800000;   // 7일

    @Getter
    @Setter
    public static class Secret {
        private String access;
        private String refresh;
    }
}
