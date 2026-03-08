package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 신고 엔티티. reports 테이블. user+targetType+targetId 유일 제약(중복 신고 방지).
 * Like 엔티티와 동일한 UNIQUE 패턴.
 */
@Getter
@Entity
@Table(name = "reports",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_report",
                        columnNames = {"user_id", "target_type", "target_id"})
        },
        indexes = {
                @Index(name = "idx_report_target", columnList = "target_type, target_id")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report extends BaseEntity {

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

    @Column(length = 500)
    private String reason;

    @Builder
    public Report(User user, LikeTargetType targetType, Long targetId, String reason) {
        this.user = user;
        this.targetType = targetType;
        this.targetId = targetId;
        this.reason = reason;
    }
}
