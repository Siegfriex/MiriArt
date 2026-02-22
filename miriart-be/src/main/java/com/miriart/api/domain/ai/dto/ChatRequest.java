package com.miriart.api.domain.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * POST /api/chat 요청 DTO (FE → BE)
 */
@Getter
@NoArgsConstructor
public class ChatRequest {

    @NotBlank(message = "메시지는 필수입니다")
    private String message;

    private String modelType = "CHAT_PRO";
    private String sessionId;
    private Map<String, Object> stickyContext;
    private String imageBase64;
    private String imageMimeType;
    private List<Map<String, Object>> history;
}
