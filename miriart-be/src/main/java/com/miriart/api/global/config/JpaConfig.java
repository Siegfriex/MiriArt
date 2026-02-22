package com.miriart.api.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA 감사(Auditing) 활성화. 생성/수정 시각 자동 채움.
 *
 * <p>연계: {@link com.miriart.api.global.entity.BaseEntity}의 createdAt, updatedAt 필드에
 * {@code @CreatedDate}, {@code @LastModifiedDate} 적용 시 이 설정으로 자동 주입.</p>
 *
 * @author MiriArt Team
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
