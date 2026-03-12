package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * POST /api/chat 응답 DTO (BE → FE). AI 멘토 응답 텍스트·퀵리플라이·세션 키.
 *
 * <p>JSON 응답에 sessionId, sessionKey 모두 포함하여 하위 호환 유지.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class ChatResponse {

    private String text;
    private List<String> groundingUrls;
    private List<String> quickReplies;
    private String sessionId;

    @JsonGetter("sessionKey")
    public String getSessionKey() {
        return this.sessionId;
    }
}
