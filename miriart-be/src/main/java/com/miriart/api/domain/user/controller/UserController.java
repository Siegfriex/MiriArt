package com.miriart.api.domain.user.controller;

import com.miriart.api.domain.analysis.service.AnalysisService;
import com.miriart.api.domain.user.dto.UserPlanResponse;
import com.miriart.api.domain.user.dto.UserProfileResponse;
import com.miriart.api.domain.user.dto.UserProfileUpdateRequest;
import com.miriart.api.domain.user.service.UserService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 사용자 API 컨트롤러. 내 프로필 조회·수정, 플랜·크레딧 조회.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>GET /api/users/me: {@link UserService#getProfile} → UserProfileResponse</li>
 *   <li>PATCH /api/users/me/profile: {@link UserService#updateProfile} (닉네임 중복 검사, 온보딩 완료)</li>
 *   <li>GET /api/users/me/plan: {@link AnalysisService#getUsedThisMonth} + {@link UserService#getPlanInfo} → UserPlanResponse</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Tag(name = "사용자", description = "프로필·플랜·크레딧 조회")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AnalysisService analysisService;

    @Operation(summary = "내 프로필 조회")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(userId)));
    }

    @Operation(summary = "프로필 수정 (온보딩 완료)")
    @PatchMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid UserProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(userId, request)));
    }

    @Operation(summary = "플랜·크레딧 조회")
    @GetMapping("/me/plan")
    public ResponseEntity<ApiResponse<UserPlanResponse>> getPlan(
            @AuthenticationPrincipal Long userId) {
        long usedThisMonth = analysisService.getUsedThisMonth(userId);
        return ResponseEntity.ok(ApiResponse.success(userService.getPlanInfo(userId, usedThisMonth)));
    }
}
