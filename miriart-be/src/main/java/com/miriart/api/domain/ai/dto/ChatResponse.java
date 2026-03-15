package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "BE → FE 채팅 응답. sections가 있으면 구조화 UX, 없으면 단일 버블 fallback.")
public class ChatResponse {

    @Schema(description = "하위 호환용 텍스트")
    private String text;

    @Schema(description = "한 줄 핵심 요약 (optional)")
    private String summary;

    @Schema(description = "역할별 섹션 배열 — strength→improvement→action 순 (optional)")
    private List<ChatSection> sections;

    private List<String> groundingUrls;
    private List<String> quickReplies;
    private String sessionId;

    @JsonGetter("sessionKey")
    public String getSessionKey() {
        return this.sessionId;
    }
}
