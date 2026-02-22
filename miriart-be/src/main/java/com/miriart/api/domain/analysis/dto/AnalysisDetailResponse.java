package com.miriart.api.domain.analysis.dto;

import com.miriart.api.domain.analysis.entity.Analysis;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * GET /api/analyses/{id} 응답 DTO. 분석 결과 상세 (이미지 URL, 등급, 점수, 코멘트 등).
 *
 * <p>연계: {@link AnalysisService#getAnalysis}, {@link AnalysisService#getMyAnalyses}에서 {@link Analysis} 엔티티를 from(analysis)로 변환해 반환.</p>
 *
 * @author MiriArt Team
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
