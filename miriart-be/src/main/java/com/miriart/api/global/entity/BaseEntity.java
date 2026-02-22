package com.miriart.api.global.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * JPA 엔티티 공통 부모. 생성/수정 시각 자동 감사.
 *
 * <p>연계: {@link com.miriart.api.global.config.JpaConfig}의 @EnableJpaAuditing으로
 * createdAt/updatedAt 자동 주입. User, Post, Analysis 등 도메인 엔티티가 상속.</p>
 *
 * @author MiriArt Team
 */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
