-- V5: chat_sessions 테이블 생성 (Phase 1 — 채팅 세션 목록 API)
CREATE TABLE chat_sessions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT       NOT NULL,
    analysis_id   BIGINT       NULL,
    session_key   VARCHAR(36)  NOT NULL UNIQUE,
    title         VARCHAR(100) NOT NULL DEFAULT '새 채팅',
    last_message  TEXT         NULL,
    message_count INT          NOT NULL DEFAULT 0,
    created_at    DATETIME(6)  NOT NULL,
    updated_at    DATETIME(6)  NOT NULL,

    INDEX idx_cs_user_updated (user_id, updated_at DESC),
    INDEX idx_cs_user_analysis (user_id, analysis_id),
    INDEX idx_cs_session_key (session_key),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (analysis_id) REFERENCES analyses(id)
);
