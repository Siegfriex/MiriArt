package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 좋아요 엔티티 (ERD_v2 likes 테이블)
 * Phase C1 구현 예정
 */
@Getter
@Entity
@Table(name = "likes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_like", columnNames = {"user_id", "target_type", "target_id"})
        },
        indexes = {
                @Index(name = "idx_target", columnList = "target_type, target_id")
        })
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 10)
    private LikeTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Like(User user, LikeTargetType targetType, Long targetId) {
        this.user = user;
        this.targetType = targetType;
        this.targetId = targetId;
    }
}
