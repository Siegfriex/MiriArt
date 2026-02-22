package com.miriart.api.domain.analysis.dto;

import com.miriart.api.domain.analysis.entity.Analysis;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * GET /api/analyses/{id} 응답 DTO
 */
@Getter
@Builder
public class AnalysisDetailResponse {

    private String id;
    private String imageUrl;
    private String status;
    private String analysisType;
    private String grade;
    private Double totalScore;
    private String scores;
    private String fixScope;
    private String comment;
    private String universityPredictions;
    private LocalDateTime createdAt;

    public static AnalysisDetailResponse from(Analysis analysis) {
        return AnalysisDetailResponse.builder()
                .id(String.valueOf(analysis.getId()))
                .imageUrl(analysis.getImageUrl())
                .status(analysis.getStatus().name())
                .analysisType(analysis.getAnalysisType())
                .grade(analysis.getGrade() != null ? analysis.getGrade().name() : null)
                .totalScore(analysis.getTotalScore())
                .scores(analysis.getScores())
                .fixScope(analysis.getFixScope() != null ? analysis.getFixScope().name() : null)
                .comment(analysis.getComment())
                .universityPredictions(analysis.getUniversityPredictions())
                .createdAt(analysis.getCreatedAt())
                .build();
    }
}
