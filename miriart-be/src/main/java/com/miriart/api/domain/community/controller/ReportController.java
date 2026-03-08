package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.ReportRequest;
import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.service.ReportService;
import com.miriart.api.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 신고 API.
 * POST /api/posts/{postId}/report (인증 필요)
 * POST /api/answers/{answerId}/report (인증 필요)
 */
@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/api/posts/{postId}/report")
    public ResponseEntity<ApiResponse<Void>> reportPost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @RequestBody(required = false) ReportRequest req) {
        reportService.reportTarget(userId, LikeTargetType.POST, postId,
                req != null ? req.reason() : null);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success());
    }

    @PostMapping("/api/answers/{answerId}/report")
    public ResponseEntity<ApiResponse<Void>> reportAnswer(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long answerId,
            @RequestBody(required = false) ReportRequest req) {
        reportService.reportTarget(userId, LikeTargetType.ANSWER, answerId,
                req != null ? req.reason() : null);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success());
    }
}
