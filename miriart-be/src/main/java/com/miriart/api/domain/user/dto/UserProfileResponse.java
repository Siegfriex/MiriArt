package com.miriart.api.domain.user.dto;

import com.miriart.api.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * GET /api/users/me 응답 DTO. 프로필 정보(닉네임·학년·도메인·역할·평판·needsProfile 등).
 *
 * <p>연계: {@link UserService#getProfile}, {@link UserService#updateProfile} 반환 타입. User 엔티티에서 from(user)로 생성.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class UserProfileResponse {

    private String id;
    private String nickname;
    private String grade;
    private String domain;
    private String provider;
    private String role;
    private String planType;
    private int reputationScore;
    private int reputationLevel;
    private boolean needsProfile;
    private LocalDateTime createdAt;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .id(String.valueOf(user.getId()))
                .nickname(user.getNickname())
                .grade(user.getGrade())
                .domain(user.getDomain())
                .provider(user.getProvider().name().toLowerCase())
                .role(user.getRole().name())
                .planType(user.getPlanType().name())
                .reputationScore(user.getReputationScore())
                .reputationLevel(user.getReputationLevel())
                .needsProfile(user.isNeedsProfile())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
