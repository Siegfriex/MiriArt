package com.miriart.api.domain.ai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * FastAPI POST /internal/ai/chat 응답 DTO
 */
@Getter
@NoArgsConstructor
public class InternalChatResponse {

    private String text;
    private List<String> groundingUrls;
    private List<String> quickReplies;
}
