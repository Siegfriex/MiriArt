package com.miriart.api.domain.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 채팅 세션 목록 응답 DTO. GET /api/chat/sessions 용.
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class ChatSessionResponse {

    private Long id;
    private String sessionKey;
    private Long analysisId;
    private String modelType;
    private String title;
    private String lastMessage;
    private int messageCount;
    private String grade;
    private Double totalScore;
    private String fixScope;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
