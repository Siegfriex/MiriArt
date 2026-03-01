package com.miriart.api.domain.auth.service;

import com.miriart.api.domain.auth.dto.TokenRefreshResponse;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.redis.RedisService;
import com.miriart.api.global.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Access Token 갱신 서비스. Refresh Token 검증 후 새 Access Token 발급.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link JwtUtil}로 Refresh 토큰 검증, userId 추출</li>
 *   <li>{@link com.miriart.api.global.redis.RedisService}에 저장된 Refresh 토큰과 비교 (탈취 감지)</li>
 *   <li>{@link com.miriart.api.domain.user.repository.UserRepository}에서 최신 role 조회 후 Access 토큰에 role claim 포함 (Bug #3)</li>
 *   <li>{@link AuthController} POST /api/auth/refresh에서 호출</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenRefreshService {

    private final JwtUtil jwtUtil;
    private final RedisService redisService;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public TokenRefreshResponse refresh(String refreshToken) {
        // 1. 토큰 유효성 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 2. Redis 저장 토큰과 비교 (탈취 감지)
        Long userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);
        String storedToken = redisService.getRefreshToken(userId);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_INVALID);
        }

        // 3. 최신 role로 새 Access Token 발급 (DB 1회 조회 — 권한 변경 즉시 반영)
        User user = userRepository.findByIdOrThrow(userId);
        String newAccessToken = jwtUtil.createAccessToken(userId, user.getRole().name());
        log.debug("Access Token 갱신 완료 - userId: {}", userId);

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .expiresIn(jwtUtil.getAccessTokenExpirationSeconds())
                .build();
    }

    public void logout(String refreshToken, Long userId) {
        if (refreshToken != null && userId != null) {
            redisService.deleteRefreshToken(userId);
        }
        log.info("로그아웃 완료 - userId: {}, refreshToken 전달 여부: {}", userId, refreshToken != null);
    }
}
