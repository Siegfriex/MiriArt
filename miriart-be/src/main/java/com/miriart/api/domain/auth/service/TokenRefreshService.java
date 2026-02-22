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
 * Access Token 갱신 서비스
 * Refresh Token 쿠키 검증 → 새 Access Token 발급
 * role claim 포함을 위해 UserRepository 조회 추가 (Bug #3 연계)
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
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
    }
}
