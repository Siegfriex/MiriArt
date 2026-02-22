package com.miriart.api.domain.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * FastAPI POST /internal/ai/analyze 응답 DTO
 */
@Getter
@NoArgsConstructor
public class InternalAnalyzeResponse {

    private String grade;
    private Double totalScore;
    private String radarData;           // JSON string
    private String fixScope;
    private String comment;
    private String universityPredictions; // JSON string
}
