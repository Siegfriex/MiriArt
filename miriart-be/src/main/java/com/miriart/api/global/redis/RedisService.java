package com.miriart.api.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis 키-값 서비스. OAuth2 코드·리프레시 토큰·채팅 세션·플랜 캐시 등 도메인별 key prefix 메서드 제공.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>OAuth2: 인가 코드 60초 TTL 저장/조회·삭제. 리프레시 토큰 7일, 블랙리스트(로그아웃)</li>
 *   <li>AI 채팅: {@link com.miriart.api.domain.ai.service.AiProxyService}에서 saveChatSession/getChatSession (72시간 TTL)로 히스토리 저장</li>
 *   <li>플랜: user:plan 캐시 1시간 (선택)</li>
 * </ul>
 *
 * <p>Cariv RedisService 이식 + MiriArt 도메인별 key prefix 메서드 추가.</p>
 *
 * @author MiriArt Team
 */
@Service
@RequiredArgsConstructor
public class RedisService {

    private static final String PREFIX = "miriart:";

    private final StringRedisTemplate redisTemplate;

    // 범용 메서드
    public void set(String key, String value, long timeoutSeconds) {
        redisTemplate.opsForValue().set(key, value, timeoutSeconds, TimeUnit.SECONDS);
    }

    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    // OAuth2 one-time code (TTL 60초)
    public void saveOAuth2Code(String code, String payload) {
        redisTemplate.opsForValue().set(
                PREFIX + "oauth2:code:" + code, payload, 60, TimeUnit.SECONDS);
    }

    public String getAndDeleteOAuth2Code(String code) {
        String key = PREFIX + "oauth2:code:" + code;
        String value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            redisTemplate.delete(key);
        }
        return value;
    }

    // Refresh Token 저장 (TTL 7일)
    public void saveRefreshToken(Long userId, String token) {
        redisTemplate.opsForValue().set(
                PREFIX + "refresh:" + userId, token, 7, TimeUnit.DAYS);
    }

    public String getRefreshToken(Long userId) {
        return redisTemplate.opsForValue().get(PREFIX + "refresh:" + userId);
    }

    public void deleteRefreshToken(Long userId) {
        redisTemplate.delete(PREFIX + "refresh:" + userId);
    }

    // Refresh Token 블랙리스트 (로그아웃 시, TTL 7일)
    public void blacklistToken(String jti) {
        redisTemplate.opsForValue().set(
                PREFIX + "refresh:blacklist:" + jti, "1", 7, TimeUnit.DAYS);
    }

    public boolean isBlacklisted(String jti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + "refresh:blacklist:" + jti));
    }

    // AI Chat 세션 (TTL 72시간)
    public void saveChatSession(String sessionId, String data) {
        redisTemplate.opsForValue().set(
                PREFIX + "chat:session:" + sessionId, data, 72, TimeUnit.HOURS);
    }

    public String getChatSession(String sessionId) {
        return redisTemplate.opsForValue().get(PREFIX + "chat:session:" + sessionId);
    }

    public void updateChatSession(String sessionId, String data) {
        // TTL 리셋하며 업데이트
        redisTemplate.opsForValue().set(
                PREFIX + "chat:session:" + sessionId, data, 72, TimeUnit.HOURS);
    }

    // 플랜 정보 캐시 (TTL 1시간)
    public void saveUserPlan(Long userId, String planJson) {
        redisTemplate.opsForValue().set(
                PREFIX + "user:plan:" + userId, planJson, 1, TimeUnit.HOURS);
    }

    public String getUserPlan(Long userId) {
        return redisTemplate.opsForValue().get(PREFIX + "user:plan:" + userId);
    }
}
