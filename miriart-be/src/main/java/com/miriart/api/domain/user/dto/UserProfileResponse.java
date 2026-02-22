package com.miriart.api.domain.user.dto;

import com.miriart.api.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * GET /api/users/me 응답 DTO
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
                .reputationScore(user.getReputationScore())
                .reputationLevel(user.getReputationLevel())
                .needsProfile(user.isNeedsProfile())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
