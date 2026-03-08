package com.miriart.api.domain.auth.service;

import com.miriart.api.domain.auth.dto.TokenExchangeResponse;
import com.miriart.api.domain.auth.oauth2.OAuth2AuthCodePayload;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.redis.RedisService;
import com.miriart.api.global.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

/**
 * OAuth2 인가 코드 → JWT 교환 서비스. Redis 1회용 코드 조회 후 Access·Refresh 발급, Refresh는 httpOnly 쿠키로 설정.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>FE가 /auth/callback?code=UUID 로 전달한 code → {@link com.miriart.api.global.redis.RedisService#getAndDeleteOAuth2Code}</li>
 *   <li>{@link OAuth2AuthCodePayload}로 userId·provider 복원 → User 조회 → {@link JwtUtil}로 JWT 발급</li>
 *   <li>Refresh 토큰 Redis 저장(7일) + Set-Cookie로 FE에 전달. {@link AuthController} POST /api/auth/token에서 호출</li>
 * </ul>
 *
 * <p>Cariv 이식 + Refresh Token httpOnly Cookie 발급 추가.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2TokenExchangeService {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    private final RedisService redisService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${miriart.auth.cookie-same-site:Lax}")
    private String cookieSameSite;

    /**
     * one-time code → JWT 교환
     * @param code Redis에 저장된 UUID
     * @param response Refresh Token Cookie를 Set-Cookie 헤더에 추가
     */
    public TokenExchangeResponse exchange(String code, HttpServletResponse response) {
        // 1. Redis에서 code 조회 + 삭제 (1회용)
        String payloadJson;
        try {
            payloadJson = redisService.getAndDeleteOAuth2Code(code);
        } catch (Exception e) {
            log.error("Redis OAuth2 코드 조회 실패 - code: {}", code, e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
        if (payloadJson == null) {
            throw new BusinessException(ErrorCode.OAUTH_CODE_INVALID);
        }

        OAuth2AuthCodePayload payload = OAuth2AuthCodePayload.fromJson(payloadJson);

        // 2. 사용자 조회
        User user = userRepository.findByIdOrThrow(payload.getUserId());

        // 3. JWT 발급 (role claim 포함 — Bug #3 Fix)
        String accessToken = jwtUtil.createAccessToken(user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.createRefreshToken(user.getId());

        // 4. Refresh Token Redis 저장 (TTL 7일)
        redisService.saveRefreshToken(user.getId(), refreshToken);

        // 5. Refresh Token httpOnly Cookie 설정 (prod: SameSite=None으로 cross-site 전송 허용)
        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite(cookieSameSite)
                .path("/api/auth/refresh")
                .maxAge(604800)  // 7일
                .build();
        response.addHeader("Set-Cookie", refreshCookie.toString());

        log.debug("JWT 발급 완료 - userId: {}", user.getId());

        return TokenExchangeResponse.builder()
                .accessToken(accessToken)
                .expiresIn(jwtUtil.getAccessTokenExpirationSeconds())
                .userId(String.valueOf(user.getId()))
                .needsProfile(user.isNeedsProfile())
                .provider(payload.getProvider())
                .role(user.getRole().name())
                .planType(user.getPlanType().name())
                .build();
    }
}
