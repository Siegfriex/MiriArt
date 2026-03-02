package com.miriart.api.domain.analysis.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.ai.dto.RadarData;
import com.miriart.api.domain.ai.dto.UniversityPrediction;
import com.miriart.api.domain.analysis.entity.Analysis;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * GET /api/analyses/{id} 및 GET /api/analyses 목록 item 응답 DTO.
 * FE 계약: imageUrl, grade, totalScore, radarData(객체), fixScope, comment, university, major.
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
    /** FE 레이더 차트용. scores JSON을 파싱한 객체. 없으면 0으로 채운 기본값. */
    private RadarData radarData;
    private String fixScope;
    private String comment;
    private String universityPredictions;
    /** FE 표시용. universityPredictions 첫 항목의 대학/전공. */
    private String university;
    private String major;
    private LocalDateTime createdAt;

    public static AnalysisDetailResponse from(Analysis analysis, ObjectMapper objectMapper) {
        RadarData radar = parseRadarData(analysis.getScores(), objectMapper);
        var first = parseFirstUniversityMajor(analysis.getUniversityPredictions(), objectMapper);
        return AnalysisDetailResponse.builder()
                .id(String.valueOf(analysis.getId()))
                .imageUrl(analysis.getImageUrl())
                .status(analysis.getStatus().name())
                .analysisType(analysis.getAnalysisType())
                .grade(analysis.getGrade() != null ? analysis.getGrade().name() : null)
                .totalScore(analysis.getTotalScore())
                .scores(analysis.getScores())
                .radarData(radar)
                .fixScope(analysis.getFixScope() != null ? analysis.getFixScope().name() : null)
                .comment(analysis.getComment() != null ? analysis.getComment() : "")
                .universityPredictions(analysis.getUniversityPredictions())
                .university(first != null ? first.getUniversity() : null)
                .major(first != null ? first.getMajor() : null)
                .createdAt(analysis.getCreatedAt())
                .build();
    }

    private static RadarData parseRadarData(String scoresJson, ObjectMapper om) {
        if (scoresJson == null || scoresJson.isBlank()) {
            RadarData d = new RadarData();
            d.setDensity(0);
            d.setForm(0);
            d.setCompletion(0);
            d.setRelevance(0);
            d.setThinking(0);
            return d;
        }
        try {
            return om.readValue(scoresJson, RadarData.class);
        } catch (JsonProcessingException e) {
            RadarData d = new RadarData();
            d.setDensity(0);
            d.setForm(0);
            d.setCompletion(0);
            d.setRelevance(0);
            d.setThinking(0);
            return d;
        }
    }

    private static UniversityPrediction parseFirstUniversityMajor(String predictionsJson, ObjectMapper om) {
        if (predictionsJson == null || predictionsJson.isBlank()) return null;
        try {
            List<UniversityPrediction> list = om.readValue(predictionsJson,
                    om.getTypeFactory().constructCollectionType(List.class, UniversityPrediction.class));
            return (list != null && !list.isEmpty()) ? list.get(0) : null;
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
