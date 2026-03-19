package com.miriart.api.domain.event.service;

import java.util.Map;

/**
 * 이벤트 발행 어댑터 인터페이스.
 * 현재: DB INSERT (EventLoggingService).
 * 중기: Kafka/PubSub 등 메시지 큐로 교체 가능.
 */
public interface EventPublisher {

    void publish(String eventType, Long userId, String sessionKey,
                 Long relatedId, Map<String, Object> extra);
}
