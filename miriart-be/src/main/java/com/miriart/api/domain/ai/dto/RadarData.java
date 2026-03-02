package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * FastAPI 분석 응답의 5축 점수(레이더 차트용). InternalAnalyzeResponse.radarData와 대응.
 *
 * @author MiriArt Team
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RadarData {

    private double density;
    private double form;
    private double completion;
    private double relevance;
    private double thinking;
}
