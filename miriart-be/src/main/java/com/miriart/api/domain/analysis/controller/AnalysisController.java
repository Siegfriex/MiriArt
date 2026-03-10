package com.miriart.api.domain.analysis.controller;

import com.miriart.api.domain.analysis.dto.AnalysisDetailResponse;
import com.miriart.api.domain.analysis.dto.AnalysisStartResponse;
import com.miriart.api.domain.analysis.service.AnalysisService;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
 * 작품 분석 API 컨트롤러. POST 업로드+분석 시작, GET 목록·단건 조회.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>POST /api/analyses: multipart 이미지 + analysisType·problemText → {@link AnalysisService#startAnalysis} → 202 Accepted + AnalysisStartResponse</li>
 *   <li>GET /api/analyses: {@link AnalysisService#getMyAnalyses} 페이지 조회 (Archive)</li>
 *   <li>GET /api/analyses/{id}: 본인 분석만 {@link AnalysisService#getAnalysis} → AnalysisDetailResponse</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Tag(name = "분석", description = "작품 분석 업로드·목록·단건")
@Slf4j
@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @Operation(summary = "작품 분석 시작", description = "multipart/form-data: image, analysisType, problemText(선택)")
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

    @Operation(summary = "내 분석 목록 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AnalysisDetailResponse>>> getMyAnalyses(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        // size 상한 제한 (DoS 방지)
        if (pageable.getPageSize() > 100) {
            pageable = org.springframework.data.domain.PageRequest.of(
                    pageable.getPageNumber(), 100, pageable.getSort());
        }
        return ResponseEntity.ok(ApiResponse.success(analysisService.getMyAnalyses(userId, pageable)));
    }

    @Operation(summary = "분석 단건 조회")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnalysisDetailResponse>> getAnalysis(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(analysisService.getAnalysis(userId, id)));
    }
}
