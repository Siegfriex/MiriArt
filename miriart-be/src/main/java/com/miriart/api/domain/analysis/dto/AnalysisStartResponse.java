package com.miriart.api.domain.analysis.dto;

import com.miriart.api.domain.analysis.entity.Analysis;
import lombok.Builder;
import lombok.Getter;

/**
 * POST /api/analyses 응답 DTO (분석 시작 즉시 반환)
 */
@Getter
@Builder
public class AnalysisStartResponse {

    private String analysisId;
    private String status;
    private String message;

    public static AnalysisStartResponse from(Analysis analysis) {
        return AnalysisStartResponse.builder()
                .analysisId(String.valueOf(analysis.getId()))
                .status(analysis.getStatus().name())
                .message("분석 중입니다. 약 8초 소요됩니다.")
                .build();
    }
}
