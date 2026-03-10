package com.miriart.api.domain.analysis.controller;

import com.miriart.api.domain.analysis.dto.ImageUrlResponse;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.response.ApiResponse;
import com.miriart.api.global.storage.SignedImageUrl;
import com.miriart.api.global.storage.SignedUrlService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 이미지 URL 발급 API. 분석 결과 이미지에 대한 GCS v4 Signed URL을 반환한다.
 *
 * <p>GET /api/images/{id}/url: analysisId로 본인 분석 조회 후 Signed URL 생성 → ImageUrlResponse.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image", description = "이미지 Signed URL 발급 API")
public class ImageController {

    private final AnalysisRepository analysisRepository;
    private final SignedUrlService signedUrlService;

    @Operation(summary = "GCS v4 Signed URL 발급", description = "analysisId로 본인 분석 이미지의 GCS v4 Signed URL을 발급한다. URL은 약 15분 유효.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Signed URL 발급 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "I001 — 분석 없음 또는 본인 소유 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "502", description = "F005 — GCS Signed URL 생성 실패")
    })
    @GetMapping("/{id}/url")
    public ResponseEntity<ApiResponse<ImageUrlResponse>> getImageUrl(
            @AuthenticationPrincipal Long userId,
            @Parameter(description = "분석 ID (analysisId)") @PathVariable Long id) {
        var analysis = analysisRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> {
                    log.warn("event=signed_url_error analysisId={} objectPath=null ttl=0 errorCode=I001", id);
                    return new BusinessException(ErrorCode.IMAGE_NOT_FOUND);
                });
        SignedImageUrl signed = signedUrlService.createSignedUrl(id, analysis.getGcsUrl());
        return ResponseEntity.ok(ApiResponse.success(
                ImageUrlResponse.of(signed.url(), signed.expiresAt())));
    }
}
