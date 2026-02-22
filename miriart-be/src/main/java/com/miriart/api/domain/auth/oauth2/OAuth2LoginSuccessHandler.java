package com.miriart.api.domain.auth.oauth2;

import com.miriart.api.global.redis.RedisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * OAuth2 로그인 성공 핸들러
 * UUID one-time code를 Redis에 저장하고 프론트엔드로 리다이렉트
 * Cariv OAuth2LoginSuccessHandler 이식 + FRONTEND_OAUTH_SUCCESS_URL env var 적용
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final RedisService redisService;

    @Value("${miriart.frontend.oauth-success-url:http://localhost:5173}")
    private String frontendOauthSuccessUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        MiriartOAuth2User oAuth2User = (MiriartOAuth2User) authentication.getPrincipal();

        String code = UUID.randomUUID().toString();
        OAuth2AuthCodePayload payload = OAuth2AuthCodePayload.of(
                oAuth2User.getUserId(),
                oAuth2User.getEmail(),
                oAuth2User.getProvider()
        );

        redisService.saveOAuth2Code(code, payload.toJson());

        String redirectUrl = frontendOauthSuccessUrl + "/auth/callback?code=" + code;
        log.debug("OAuth2 성공 리다이렉트 → {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
