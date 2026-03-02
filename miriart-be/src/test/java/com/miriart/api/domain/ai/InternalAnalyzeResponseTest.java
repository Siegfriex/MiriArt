package com.miriart.api.domain.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.ai.dto.RadarData;
import com.miriart.api.domain.ai.dto.UniversityPrediction;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * P1 Step 4: FastAPI 응답 JSON → InternalAnalyzeResponse 역직렬화 (radarData 객체, universityPredictions 리스트).
 */
class InternalAnalyzeResponseTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("camelCase JSON → radarData(RadarData), universityPredictions(List) 역직렬화")
    void deserialize_fromFastApiStyleJson() throws Exception {
        String json = """
                {
                  "grade": "A",
                  "totalScore": 85.5,
                  "radarData": {
                    "density": 85,
                    "form": 80,
                    "completion": 78,
                    "relevance": 88,
                    "thinking": 79
                  },
                  "fixScope": "DetailTuning",
                  "comment": "테스트 코멘트",
                  "universityPredictions": [
                    {
                      "university": "홍익대학교",
                      "major": "시각디자인",
                      "line": "HIGH",
                      "probability": 68,
                      "similarAcceptedCount": 14
                    }
                  ]
                }
                """;

        InternalAnalyzeResponse response = objectMapper.readValue(json, InternalAnalyzeResponse.class);

        assertThat(response.getGrade()).isEqualTo("A");
        assertThat(response.getTotalScore()).isEqualTo(85.5);
        assertThat(response.getRadarData()).isNotNull();
        RadarData radar = response.getRadarData();
        assertThat(radar.getDensity()).isEqualTo(85);
        assertThat(radar.getForm()).isEqualTo(80);
        assertThat(response.getUniversityPredictions()).hasSize(1);
        UniversityPrediction pred = response.getUniversityPredictions().get(0);
        assertThat(pred.getUniversity()).isEqualTo("홍익대학교");
        assertThat(pred.getSimilarAcceptedCount()).isEqualTo(14);
    }
}
