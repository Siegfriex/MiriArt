package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * FastAPI POST /internal/ai/chat 요청 DTO (BE → FastAPI). Python Pydantic InternalChatRequest와 필드 대응.
 *
 * <p>연계: {@link AiProxyService#chat}에서 {@link ChatRequest}를 이 DTO로 변환해 WebClient bodyValue로 전송.</p>
 *
 * @author MiriArt Team
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
