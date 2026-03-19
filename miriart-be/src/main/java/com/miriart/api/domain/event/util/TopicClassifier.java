package com.miriart.api.domain.event.util;

import java.util.List;
import java.util.Map;

/**
 * 규칙 기반 토픽 분류기. truncated_content에서 키워드 매칭으로 토픽 결정.
 * 중기: AI 기반 분류 엔드포인트(/internal/ai/classify-topic)로 교체 예정.
 */
public final class TopicClassifier {

    private TopicClassifier() {}

    private static final Map<String, List<String>> TOPIC_KEYWORDS = Map.of(
            "CAREER_SCHOOL", List.of("진로", "진학", "학교", "대학", "학과", "입시", "전형", "지원"),
            "ARTWORK_REVISION", List.of("수정", "고쳐", "보완", "피드백", "디테일", "완성도", "다시"),
            "PORTFOLIO_STRATEGY", List.of("포트폴리오", "포폴", "구성", "기획", "시리즈", "작품 수"),
            "EXAM_PREP", List.of("모의", "실기", "시간", "일정", "훈련", "준비")
    );

    /**
     * 텍스트에서 키워드 매칭으로 토픽 분류. 매칭 키워드가 가장 많은 토픽 반환.
     * @return 토픽 코드 또는 "OTHER"
     */
    public static String classify(String text) {
        if (text == null || text.isBlank()) return "OTHER";

        String bestTopic = "OTHER";
        int maxHits = 0;

        for (var entry : TOPIC_KEYWORDS.entrySet()) {
            int hits = 0;
            for (String keyword : entry.getValue()) {
                if (text.contains(keyword)) hits++;
            }
            if (hits > maxHits) {
                maxHits = hits;
                bestTopic = entry.getKey();
            }
        }
        return bestTopic;
    }
}
