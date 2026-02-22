package com.miriart.api.domain.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * POST /api/chat 요청 DTO (FE → BE). AI 멘토에게 보낼 메시지·모델·세션·히스토리·이미지.
 *
 * <p>연계: FE에서 전달 → {@link com.miriart.api.domain.ai.controller.AiChatController}가 {@link com.miriart.api.domain.ai.service.AiProxyService#chat}에 전달 →
 * {@link InternalChatRequest}로 변환 후 FastAPI /internal/ai/chat body로 전송.</p>
 *
 * @author MiriArt Team
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
