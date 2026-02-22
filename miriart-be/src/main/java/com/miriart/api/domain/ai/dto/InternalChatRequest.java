package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * FastAPI POST /internal/ai/chat 요청 DTO (BE → FastAPI)
 */
@Getter
@Builder
public class InternalChatRequest {

    private String modelType;
    private String message;
    private Map<String, Object> stickyContext;
    private List<Map<String, Object>> history;
    private String imageBase64;
    private String imageMimeType;
}
