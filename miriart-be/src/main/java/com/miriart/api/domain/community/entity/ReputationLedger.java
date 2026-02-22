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
 * 평판 포인트 이력 원장 (ERD_v2 reputation_ledger 테이블)
 * 실제 합계는 users.reputation_score에 반영
 * Phase C1 구현 예정
 */
@Getter
@Entity
@Table(name = "reputation_ledger",
        indexes = {
                @Index(name = "idx_user_created", columnList = "user_id, created_at")
        })
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReputationLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int delta;

    @Column(nullable = false, length = 50)
    private String reason;

    @Column(name = "ref_type", length = 20)
    private String refType;

    @Column(name = "ref_id")
    private Long refId;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public ReputationLedger(User user, int delta, String reason, String refType, Long refId) {
        this.user = user;
        this.delta = delta;
        this.reason = reason;
        this.refType = refType;
        this.refId = refId;
    }
}
