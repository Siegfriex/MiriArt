package com.miriart.api.domain.user.controller;

import com.miriart.api.domain.analysis.service.AnalysisService;
import com.miriart.api.domain.user.dto.UserPlanResponse;
import com.miriart.api.domain.user.dto.UserProfileResponse;
import com.miriart.api.domain.user.dto.UserProfileUpdateRequest;
import com.miriart.api.domain.user.service.UserService;
import com.miriart.api.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 API 컨트롤러
 * GET  /api/users/me            — 내 프로필 조회
 * PATCH /api/users/me/profile   — 온보딩 프로필 입력
 * GET  /api/users/me/plan       — 플랜 및 크레딧 조회
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AnalysisService analysisService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(userId)));
    }

    @PatchMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid UserProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(userId, request)));
    }

    @GetMapping("/me/plan")
    public ResponseEntity<ApiResponse<UserPlanResponse>> getPlan(
            @AuthenticationPrincipal Long userId) {
        long usedThisMonth = analysisService.getUsedThisMonth(userId);
        return ResponseEntity.ok(ApiResponse.success(userService.getPlanInfo(userId, usedThisMonth)));
    }
}
