package com.miriart.api.domain.user.service;

import com.miriart.api.domain.user.dto.UserPlanResponse;
import com.miriart.api.domain.user.dto.UserProfileResponse;
import com.miriart.api.domain.user.dto.UserProfileUpdateRequest;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 사용자 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = findById(userId);
        return UserProfileResponse.from(user);
    }

    /**
     * 온보딩 프로필 완성 (PATCH /api/users/me/profile)
     */
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = findById(userId);

        // 닉네임 중복 검사
        if (!request.getNickname().equals(user.getNickname())
                && userRepository.existsByNickname(request.getNickname())) {
            throw new BusinessException(ErrorCode.DUPLICATE_NICKNAME);
        }

        user.completeProfile(request.getNickname(), request.getGrade(), request.getDomain());
        log.debug("프로필 완성 - userId: {}, nickname: {}", userId, request.getNickname());

        return UserProfileResponse.from(user);
    }

    /**
     * 플랜 및 크레딧 정보 조회 (GET /api/users/me/plan)
     * 실제 usage count는 AnalysisService에서 분리 조회 (Phase 1 단순화: 파라미터 전달)
     */
    @Transactional(readOnly = true)
    public UserPlanResponse getPlanInfo(Long userId, long usedThisMonth) {
        User user = findById(userId);
        int monthlyLimit = user.getPlanType().getMonthlyLimit();
        long remaining = Math.max(0, monthlyLimit - usedThisMonth);

        LocalDate billingPeriodStart = LocalDate.now().withDayOfMonth(1);

        return UserPlanResponse.builder()
                .plan(user.getPlanType().name())
                .monthlyLimit(monthlyLimit)
                .usedThisMonth(usedThisMonth)
                .remaining(remaining)
                .billingPeriodStart(billingPeriodStart)
                .build();
    }

    private User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    private String currentBillingMonth() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }
}
