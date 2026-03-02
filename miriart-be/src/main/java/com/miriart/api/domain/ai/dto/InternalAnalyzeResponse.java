package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * FastAPI POST /internal/ai/analyze 응답 DTO. 등급·총점·레이더(객체)·fix_scope·코멘트·대학예측(리스트).
 * <p>P1: FastAPI 스키마(radar_data, university_predictions)와 타입 정합. DB 저장 시 JSON 문자열로 직렬화.</p>
 *
 * <p>연계: FastAPI가 반환한 JSON을 WebClient가 이 타입으로 역직렬화 →
 * {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 엔티티 저장·상세 응답 생성.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InternalAnalyzeResponse {

    private String grade;
    private Double totalScore;
    private RadarData radarData;
    private String fixScope;
    private String comment;
    private List<UniversityPrediction> universityPredictions;
}
