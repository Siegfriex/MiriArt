-- V8__create_user_cohorts.sql
-- 행동 로그 기반 코호트 분석: 유저별 코호트 집계 테이블
CREATE TABLE user_cohorts (
    id                   BIGINT      NOT NULL AUTO_INCREMENT,
    user_id              BIGINT      NOT NULL UNIQUE,
    first_topic          VARCHAR(30) NULL,
    first_analysis_grade CHAR(1)     NULL,
    first_visit_date     DATE        NULL,
    first_chat_date      DATE        NULL,
    first_upload_date    DATE        NULL,
    created_at           DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_topic       (first_topic),
    INDEX idx_first_visit (first_visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
