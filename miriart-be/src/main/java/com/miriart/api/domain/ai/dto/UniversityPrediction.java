package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * FastAPI 분석 응답의 대학·전공 합격 예측 1건. InternalAnalyzeResponse.universityPredictions 리스트 요소.
 *
 * @author MiriArt Team
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UniversityPrediction {

    private String university;
    private String major;
    private String line;   // TOP | HIGH | MID | LOW
    private int probability;
    @JsonProperty("similarAcceptedCount")
    private int similarAcceptedCount;
}
