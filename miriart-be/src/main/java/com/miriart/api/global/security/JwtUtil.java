package com.miriart.api.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

/**
 * JWT 토큰 생성/검증 유틸리티
 * Cariv JwtUtil 이식 + role claim 추가 (Bug #3 Fix)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private static final String CLAIM_USER_ID = "userId";
    private static final String CLAIM_TYPE = "type";
    private static final String CLAIM_ROLE = "role";

    private final JwtProperties jwtProperties;

    /**
     * Access Token 생성 (userId + role 포함)
     */
    public String createAccessToken(Long userId, String role) {
        return createToken(userId, role, "access",
                jwtProperties.getSecret().getAccess(),
                jwtProperties.getAccessExpirationMs());
    }

    public String createRefreshToken(Long userId) {
        return createToken(userId, null, "refresh",
                jwtProperties.getSecret().getRefresh(),
                jwtProperties.getRefreshExpirationMs());
    }

    public int getAccessTokenExpirationSeconds() {
        return (int) (jwtProperties.getAccessExpirationMs() / 1000);
    }

    private String createToken(Long userId, String role, String type, String secret, long expirationMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        var builder = Jwts.builder()
                .claim(CLAIM_USER_ID, userId)
                .claim(CLAIM_TYPE, type)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key);

        if (role != null) {
            builder.claim(CLAIM_ROLE, role);
        }
        return builder.compact();
    }

    public Long getUserIdFromAccessToken(String token) {
        Claims claims = parseToken(token, jwtProperties.getSecret().getAccess());
        return claims.get(CLAIM_USER_ID, Long.class);
    }

    /**
     * Access Token에서 role claim 추출
     */
    public String getRoleFromAccessToken(String token) {
        Claims claims = parseToken(token, jwtProperties.getSecret().getAccess());
        return claims.get(CLAIM_ROLE, String.class);
    }

    public Long getUserIdFromRefreshToken(String token) {
        Claims claims = parseToken(token, jwtProperties.getSecret().getRefresh());
        return claims.get(CLAIM_USER_ID, Long.class);
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, jwtProperties.getSecret().getAccess());
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, jwtProperties.getSecret().getRefresh());
    }

    private Claims parseToken(String token, String secret) {
        SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean validateToken(String token, String secret) {
        try {
            parseToken(token, secret);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("만료된 JWT 토큰: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.debug("유효하지 않은 JWT 토큰: {}", e.getMessage());
            return false;
        }
    }

}
