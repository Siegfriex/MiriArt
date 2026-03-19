-- V7__create_user_events.sql
-- 행동 로그 기반 코호트 분석: 이벤트 수집 테이블
CREATE TABLE IF NOT EXISTS user_events (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    user_id     BIGINT        NULL,
    session_key VARCHAR(64)   NULL,
    event_type  VARCHAR(50)   NOT NULL,
    source      VARCHAR(20)   NULL,
    page        VARCHAR(100)  NULL,
    referrer    VARCHAR(200)  NULL,
    related_id  BIGINT        NULL,
    error_code  VARCHAR(20)   NULL,
    extra       JSON          NULL,
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_user_created   (user_id, created_at),
    INDEX idx_event_created  (event_type, created_at),
    INDEX idx_session_key    (session_key, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
