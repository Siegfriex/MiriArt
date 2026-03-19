package com.miriart.api.domain.event.scheduler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.event.entity.UserCohort;
import com.miriart.api.domain.event.entity.UserEvent;
import com.miriart.api.domain.event.repository.UserCohortRepository;
import com.miriart.api.domain.event.repository.UserEventRepository;
import com.miriart.api.domain.event.util.PiiFilter;
import com.miriart.api.domain.event.util.TopicClassifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 매일 새벽 02:30 user_events → user_cohorts 집계 배치.
 * 증분 처리: 직전 25시간 이벤트만 조회 (OOM 방지 + 다중 인스턴스 중복 실행 대비 여유).
 * 멱등성: UNIQUE(user_id) + findOrCreate with race condition 방어 (try-catch DataIntegrityViolation).
 * 중기: ShedLock 또는 Cloud Scheduler + Cloud Run Jobs로 분리.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CohortBatchScheduler {

    private final UserEventRepository userEventRepository;
    private final UserCohortRepository userCohortRepository;
    private final ObjectMapper objectMapper;

    @Scheduled(cron = "0 30 2 * * *")
    @Transactional
    public void aggregateCohorts() {
        log.info("CohortBatch: 시작");

        // 증분 처리: 직전 25시간 이벤트만 (02:30 기준 → 전날 01:30 이후)
        LocalDateTime since = LocalDateTime.now().minusHours(25);
        List<UserEvent> recentEvents = userEventRepository
                .findByUserIdIsNotNullAndCreatedAtAfter(since);

        Map<Long, List<UserEvent>> eventsByUser = recentEvents.stream()
                .collect(Collectors.groupingBy(UserEvent::getUserId));

        int created = 0;
        int updated = 0;

        for (var entry : eventsByUser.entrySet()) {
            Long userId = entry.getKey();
            List<UserEvent> events = entry.getValue();

            // race condition 방어: 다중 인스턴스 동시 실행 시 UNIQUE 위반을 catch 후 기존 row 사용
            UserCohort cohort;
            boolean isNew;
            var existing = userCohortRepository.findByUserId(userId);
            if (existing.isPresent()) {
                cohort = existing.get();
                isNew = false;
            } else {
                try {
                    cohort = userCohortRepository.saveAndFlush(new UserCohort(userId));
                    isNew = true;
                } catch (DataIntegrityViolationException e) {
                    // 다른 인스턴스가 먼저 INSERT 성공 → 해당 row 사용
                    cohort = userCohortRepository.findByUserId(userId).orElse(null);
                    if (cohort == null) {
                        log.warn("CohortBatch: userId={} UNIQUE 위반 후 조회도 실패, skip", userId);
                        continue;
                    }
                    isNew = false;
                }
            }

            for (UserEvent event : events) {
                LocalDate eventDate = event.getCreatedAt().toLocalDate();

                switch (event.getEventType()) {
                    case "PAGE_VIEW" -> cohort.updateFirstVisitDate(eventDate);
                    case "CHAT_STARTED" -> cohort.updateFirstChatDate(eventDate);
                    case "ANALYSIS_UPLOADED" -> cohort.updateFirstUploadDate(eventDate);
                    case "CHAT_MESSAGE_SENT" -> {
                        if (cohort.getFirstTopic() == null) {
                            String content = extractTruncatedContent(event);
                            if (content != null) {
                                String masked = PiiFilter.mask(content);
                                String topic = classifyTopic(masked);
                                cohort.updateFirstTopic(topic);
                            }
                        }
                    }
                    case "ANALYSIS_COMPLETED" -> {
                        if (cohort.getFirstAnalysisGrade() == null) {
                            String grade = extractGrade(event);
                            cohort.updateFirstAnalysisGrade(grade);
                        }
                    }
                }
            }

            if (isNew) created++;
            else updated++;
        }

        log.info("CohortBatch: 완료 — created={}, updated={}, eventsProcessed={}",
                created, updated, recentEvents.size());
    }

    /**
     * 토픽 분류 로직. 현재: 규칙 기반 키워드 매칭.
     * 중기: AI 분류 엔드포인트(/internal/ai/classify-topic) 호출로 교체.
     */
    private String classifyTopic(String text) {
        return TopicClassifier.classify(text);
    }

    private String extractTruncatedContent(UserEvent event) {
        return extractJsonField(event, "truncated_content");
    }

    private String extractGrade(UserEvent event) {
        return extractJsonField(event, "grade");
    }

    private String extractJsonField(UserEvent event, String field) {
        if (event.getExtra() == null) return null;
        try {
            JsonNode node = objectMapper.readTree(event.getExtra());
            JsonNode value = node.get(field);
            return value != null ? value.asText() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
