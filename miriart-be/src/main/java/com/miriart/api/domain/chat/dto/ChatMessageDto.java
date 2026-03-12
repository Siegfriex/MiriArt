package com.miriart.api.domain.chat.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Redis 채팅 히스토리 메시지 DTO.
 * GET /api/chat/sessions/{sessionKey}/messages 응답 요소.
 */
@Getter
@Builder
public class ChatMessageDto {

    private String id;
    private String sender;   // "USER" | "AI"
    private String type;     // "TEXT"
    private String content;
    private Long timestamp;
}
