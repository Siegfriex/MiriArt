package com.miriart.api.global.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 설정 프로퍼티. application.yml의 {@code miriart.jwt.*} 키와 바인딩.
 *
 * <p>연계: {@link JwtUtil}에서 주입받아 access/refresh 시크릿·만료 시간(access 15분, refresh 7일) 사용.</p>
 *
 * @author MiriArt Team
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
