package com.miriart.api.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * Redis 설정. StringRedisTemplate 빈 등록.
 *
 * <p>연계: {@link com.miriart.api.global.redis.RedisService}에서 채팅 세션 히스토리 저장(72시간 TTL)에 사용.
 * application-dev.yml / application-prod.yml의 spring.data.redis 호스트 설정 사용.</p>
 *
 * @author MiriArt Team
 */
@Configuration
public class RedisConfig {

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
