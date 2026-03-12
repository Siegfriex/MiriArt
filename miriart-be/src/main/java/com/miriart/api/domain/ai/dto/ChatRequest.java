package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * POST /api/chat 요청 DTO (FE → BE). AI 멘토에게 보낼 메시지·모델·세션·히스토리·이미지.
 *
 * <p>{@code sessionKey}는 UUID 세션 키. 하위 호환을 위해 {@code sessionId} JSON 키도 수용.</p>
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
public class ChatRequest {

    @NotBlank(message = "메시지는 필수입니다")
    private String message;

    private String modelType = "CHAT_PRO";

    @JsonAlias("sessionId")
    private String sessionKey;

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    /** @deprecated use {@link #getSessionKey()} */
    @Deprecated
    public String getSessionId() {
        return this.sessionKey;
    }

    /** @deprecated use {@link #setSessionKey(String)} */
    @Deprecated
    public void setSessionId(String sessionId) {
        this.sessionKey = sessionId;
    }

    private Map<String, Object> stickyContext;
    private String imageBase64;
    private String imageMimeType;
    private List<Map<String, Object>> history;
}
