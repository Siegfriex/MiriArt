package com.miriart.api.domain.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * FastAPI POST /internal/ai/analyze 응답 DTO. 등급·총점·레이더·fix_scope·코멘트·대학예측(JSON 문자열).
 *
 * <p>연계: FastAPI가 반환한 JSON을 WebClient가 이 타입으로 역직렬화 →
 * {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 엔티티 저장·상세 응답 생성.</p>
 *
 * @author MiriArt Team
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
