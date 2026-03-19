package com.miriart.api.domain.event.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 유저 행동 이벤트 로그. best-effort 저장 — INSERT 실패해도 비즈니스 로직에 영향 없음.
 */
@Entity
@Table(name = "user_events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(length = 64)
    private String sessionKey;

    @Column(nullable = false, length = 50)
    private String eventType;

    @Column(length = 20)
    private String source;

    @Column(length = 100)
    private String page;

    @Column(length = 200)
    private String referrer;

    private Long relatedId;

    @Column(length = 20)
    private String errorCode;

    @Column(columnDefinition = "json")
    private String extra;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    private UserEvent(String eventType, Long userId, String sessionKey,
                      String source, String page, String referrer,
                      Long relatedId, String errorCode, String extra) {
        this.eventType = eventType;
        this.userId = userId;
        this.sessionKey = sessionKey;
        this.source = source;
        this.page = page;
        this.referrer = referrer;
        this.relatedId = relatedId;
        this.errorCode = errorCode;
        this.extra = extra;
    }

    public static UserEvent of(String eventType, Long userId, String sessionKey,
                                Long relatedId, String extra) {
        return new UserEvent(eventType, userId, sessionKey,
                null, null, null, relatedId, null, extra);
    }

    public static UserEvent pageView(Long userId, String sessionKey, String source,
                                      String page, String referrer, String extra) {
        // source null → "WEB" normalize (FE가 미전송 시 기본값)
        String normalizedSource = (source != null && !source.isBlank()) ? source : "WEB";
        return new UserEvent("PAGE_VIEW", userId, sessionKey,
                normalizedSource, page, referrer, null, null, extra);
    }

    public static UserEvent error(Long userId, String path, String errorCode,
                                   int httpStatus, String extra) {
        UserEvent event = new UserEvent("ERROR_OCCURRED", userId, null,
                null, path, null, null, errorCode, extra);
        return event;
    }
}
