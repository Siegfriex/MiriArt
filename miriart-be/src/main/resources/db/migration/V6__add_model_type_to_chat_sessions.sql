ALTER TABLE chat_sessions
    ADD COLUMN model_type VARCHAR(20) NOT NULL DEFAULT 'CHAT_PRO' AFTER session_key;
