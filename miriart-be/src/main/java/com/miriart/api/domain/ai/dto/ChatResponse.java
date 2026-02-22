package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * POST /api/chat 응답 DTO (BE → FE)
 */
@Getter
@Builder
public class ChatResponse {

    private String text;
    private List<String> groundingUrls;
    private List<String> quickReplies;
    private String sessionId;
}
