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
 * OAuth2 로그인 성공 핸들러. UUID 1회용 코드를 Redis에 저장 후 FE OAuth 콜백 URL로 리다이렉트.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link CustomOAuth2UserService} 로드 후 인증 성공 시 Spring이 이 핸들러 호출</li>
 *   <li>{@link MiriartOAuth2User}에서 userId·email·provider 추출 → {@link OAuth2AuthCodePayload} 생성</li>
 *   <li>{@link com.miriart.api.global.redis.RedisService#saveOAuth2Code} (60초 TTL) 후 FE {@code miriart.frontend.oauth-success-url}/auth/callback?code= 로 리다이렉트</li>
 *   <li>FE가 이 code로 POST /api/auth/token 호출 → {@link OAuth2TokenExchangeService}</li>
 * </ul>
 *
 * @author MiriArt Team
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
        log.debug("OAuth2 성공 리다이렉트 → {} (code 생략)", frontendOauthSuccessUrl + "/auth/callback?code=***");
        response.sendRedirect(redirectUrl);
    }
}
