package com.miriart.api.domain.analysis.controller;

import com.miriart.api.domain.analysis.dto.AnalysisDetailResponse;
import com.miriart.api.domain.analysis.dto.AnalysisStartResponse;
import com.miriart.api.domain.analysis.service.AnalysisService;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 작품 분석 API 컨트롤러
 * POST /api/analyses       — 작품 업로드 + 분석 시작
 * GET  /api/analyses       — 내 분석 목록 (Archive)
 * GET  /api/analyses/{id}  — 분석 결과 단건 조회
 */
@Slf4j
@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<AnalysisStartResponse>> startAnalysis(
            @AuthenticationPrincipal Long userId,
            @RequestPart("image") MultipartFile image,
            @RequestParam("analysisType") String analysisType,
            @RequestParam(value = "problemText", required = false) String problemText) {
        try {
            AnalysisStartResponse result = analysisService.startAnalysis(userId, image, analysisType, problemText);
            return ResponseEntity.accepted().body(ApiResponse.success(result));
        } catch (IOException e) {
            log.error("파일 업로드 오류: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AnalysisDetailResponse>>> getMyAnalyses(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(analysisService.getMyAnalyses(userId, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnalysisDetailResponse>> getAnalysis(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(analysisService.getAnalysis(userId, id)));
    }
}
