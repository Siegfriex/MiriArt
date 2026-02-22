package com.miriart.api.domain.user.entity;

import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔티티. users 테이블 매핑. 소셜 로그인 전용(이메일/비밀번호 없음).
 *
 * <p>연계: {@link com.miriart.api.domain.auth.oauth2.CustomOAuth2UserService}에서 조회/생성.
 * {@link AnalysisService}에서 플랜 한도 조회, {@link UserService}에서 프로필·플랜 API. JWT role claim은 이 엔티티 role 사용.</p>
 *
 * <p>ERD_v2 users 테이블 기반.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_provider", columnNames = {"provider", "provider_user_id"}),
                @UniqueConstraint(name = "uq_nickname", columnNames = {"nickname"})
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private LoginProvider provider;

    @Column(name = "provider_user_id", nullable = false, length = 100)
    private String providerUserId;

    @Column(length = 200)
    private String email;

    @Column(length = 30)
    private String nickname;

    @Column(length = 20)
    private String grade;

    @Column(length = 30)
    private String domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PlanType planType = PlanType.FREE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private UserRole role = UserRole.USER;

    @Column(name = "needs_profile", nullable = false)
    private boolean needsProfile = true;

    @Column(name = "reputation_score", nullable = false)
    private int reputationScore = 0;

    @Column(name = "reputation_level", nullable = false)
    private int reputationLevel = 1;

    @Builder
    public User(LoginProvider provider, String providerUserId, String email) {
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.email = email;
    }

    /**
     * 온보딩 프로필 완성 (최초 1회)
     */
    public void completeProfile(String nickname, String grade, String domain) {
        this.nickname = nickname;
        this.grade = grade;
        this.domain = domain;
        this.needsProfile = false;
    }

    /**
     * 평판 포인트 증감
     */
    public void addReputation(int delta) {
        this.reputationScore = Math.max(0, this.reputationScore + delta);
        this.reputationLevel = calculateLevel(this.reputationScore);
    }

    private int calculateLevel(int score) {
        if (score >= 500) return 12;
        if (score >= 300) return 10;
        if (score >= 150) return 8;
        if (score >= 75) return 6;
        if (score >= 30) return 4;
        if (score >= 10) return 2;
        return 1;
    }
}
