package com.miriart.api.domain.analysis.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.ai.dto.RadarData;
import com.miriart.api.domain.ai.dto.UniversityPrediction;
import com.miriart.api.domain.analysis.entity.Analysis;
import lombok.Builder;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * GET /api/analyses/{id} 및 GET /api/analyses 목록 item 응답 DTO.
 * <p>FE 계약: imageUrl, grade, totalScore, radarData, fixScope, comment(summaryComment), universityPredictionsList, university, major.</p>
 * <p><b>comment</b>는 FE에서 summaryComment로 매핑해 사용합니다.</p>
 * <p><b>targetMajor / targetUniversity</b>는 본 API에서 제공하지 않습니다. FE는 universityPredictionsList 첫 항목을 사용하거나 null로 두세요.</p>
 */
@Getter
@Builder
public class AnalysisDetailResponse {

    private static final Logger log = LoggerFactory.getLogger(AnalysisDetailResponse.class);

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
    /** 대학·전공 예측 배열. stickyContext.summaryText 등 FE에서 구조화 데이터로 사용. */
    private List<UniversityPrediction> universityPredictionsList;
    /** 하위 호환용. FE는 universityPredictionsList 사용 권장. */
    @Deprecated
    private String universityPredictions;
    /** FE 표시용. universityPredictionsList 첫 항목의 대학/전공. */
    private String university;
    private String major;
    private LocalDateTime createdAt;

    public static AnalysisDetailResponse from(Analysis analysis, ObjectMapper objectMapper) {
        RadarData radar = parseRadarData(analysis.getScores(), objectMapper);
        List<UniversityPrediction> list = parseUniversityPredictionsList(analysis.getUniversityPredictions(), objectMapper);
        UniversityPrediction first = (list != null && !list.isEmpty()) ? list.get(0) : null;

        if (log.isDebugEnabled()) {
            log.debug("[AnalysisDetail] analysisId={}, rawPredictionsLen={}, parsedListSize={}, first=[univ={}, major={}]",
                    analysis.getId(),
                    analysis.getUniversityPredictions() != null ? analysis.getUniversityPredictions().length() : 0,
                    list != null ? list.size() : 0,
                    first != null ? first.getUniversity() : "null",
                    first != null ? first.getMajor() : "null");
        }

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
                .universityPredictionsList(list != null ? list : Collections.emptyList())
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

    private static List<UniversityPrediction> parseUniversityPredictionsList(String predictionsJson, ObjectMapper om) {
        if (predictionsJson == null || predictionsJson.isBlank()) return Collections.emptyList();
        try {
            List<UniversityPrediction> list = om.readValue(predictionsJson,
                    om.getTypeFactory().constructCollectionType(List.class, UniversityPrediction.class));
            return list != null ? list : Collections.emptyList();
        } catch (JsonProcessingException e) {
            log.warn("[parseUniversityPredictions] JSON 파싱 실패 — input 길이={}, error={}",
                    predictionsJson.length(), e.getMessage());
            return Collections.emptyList();
        }
    }
}
