package com.miriart.api.domain.event.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.event.entity.UserEvent;
import com.miriart.api.domain.event.repository.UserEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * 비동기 이벤트 로깅 서비스. best-effort — INSERT 실패해도 비즈니스 로직에 영향 없음.
 * {@link EventPublisher} 어댑터 구현: 현재는 DB 직접 INSERT, 추후 메시지 큐로 교체 가능.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EventLoggingService implements EventPublisher {

    private final UserEventRepository userEventRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Async("eventExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void publish(String eventType, Long userId, String sessionKey,
                        Long relatedId, Map<String, Object> extra) {
        try {
            String extraJson = (extra != null && !extra.isEmpty())
                    ? objectMapper.writeValueAsString(extra)
                    : null;
            UserEvent event = UserEvent.of(eventType, userId, sessionKey, relatedId, extraJson);
            userEventRepository.save(event);
        } catch (Exception e) {
            log.warn("EventLogging failed: type={}, userId={}, error={}",
                    eventType, userId, e.getMessage());
        }
    }

    /**
     * PAGE_VIEW 전용 — FE에서 받은 페이지/리퍼러/소스 포함.
     */
    @Async("eventExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void publishPageView(Long userId, String sessionKey, String source,
                                 String page, String referrer, Map<String, Object> extra) {
        try {
            String extraJson = (extra != null && !extra.isEmpty())
                    ? objectMapper.writeValueAsString(extra)
                    : null;
            UserEvent event = UserEvent.pageView(userId, sessionKey, source, page, referrer, extraJson);
            userEventRepository.save(event);
        } catch (Exception e) {
            log.warn("EventLogging PAGE_VIEW failed: userId={}, page={}, error={}",
                    userId, page, e.getMessage());
        }
    }

    /**
     * ERROR_OCCURRED 전용 — GlobalExceptionHandler에서 호출.
     */
    @Async("eventExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void publishError(Long userId, String path, String errorCode,
                              int httpStatus, Map<String, Object> extra) {
        try {
            String extraJson = (extra != null && !extra.isEmpty())
                    ? objectMapper.writeValueAsString(extra)
                    : null;
            UserEvent event = UserEvent.error(userId, path, errorCode, httpStatus, extraJson);
            userEventRepository.save(event);
        } catch (Exception e) {
            log.warn("EventLogging ERROR failed: errorCode={}, path={}, error={}",
                    errorCode, path, e.getMessage());
        }
    }
}
