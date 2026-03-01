package com.miriart.api.domain.auth.controller;

import com.miriart.api.domain.auth.dto.TokenExchangeRequest;
import com.miriart.api.domain.auth.dto.TokenExchangeResponse;
import com.miriart.api.domain.auth.dto.TokenRefreshResponse;
import com.miriart.api.domain.auth.service.OAuth2TokenExchangeService;
import com.miriart.api.domain.auth.service.TokenRefreshService;
import com.miriart.api.global.response.ApiResponse;
import com.miriart.api.global.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;

import java.util.Arrays;

/**
 * 인증 API 컨트롤러. OAuth2 코드→JWT 교환, Access 토큰 갱신, 로그아웃.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>POST /api/auth/token: FE가 OAuth 리다이렉트 후 받은 code 전달 → {@link OAuth2TokenExchangeService#exchange} → JWT + Refresh 쿠키</li>
 *   <li>POST /api/auth/refresh: 쿠키의 refreshToken으로 {@link TokenRefreshService#refresh} → 새 Access 토큰</li>
 *   <li>POST /api/auth/logout: {@link TokenRefreshService#logout} + Refresh 쿠키 만료</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    private final OAuth2TokenExchangeService tokenExchangeService;
    private final TokenRefreshService tokenRefreshService;
    private final JwtUtil jwtUtil;

    @Value("${miriart.auth.cookie-same-site:Lax}")
    private String cookieSameSite;

    /**
     * OAuth2 one-time code → JWT 교환
     */
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<TokenExchangeResponse>> exchangeToken(
            @RequestBody @Valid TokenExchangeRequest request,
            HttpServletResponse response) {
        TokenExchangeResponse result = tokenExchangeService.exchange(request.getCode(), response);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Access Token 갱신 (쿠키의 refreshToken 사용)
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(
            HttpServletRequest request) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        TokenRefreshResponse result = tokenRefreshService.refresh(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * 로그아웃 — Redis refresh token 삭제 + 쿠키 만료
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal Long userId,
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        tokenRefreshService.logout(refreshToken, userId);

        // 쿠키 만료 처리 (SameSite는 토큰 발급 시와 동일하게 — prod에서 None)
        ResponseCookie expiredCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite(cookieSameSite)
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", expiredCookie.toString());

        return ResponseEntity.noContent().build();
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(c -> REFRESH_TOKEN_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
