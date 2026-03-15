package com.miriart.api.domain.ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * AI 채팅 응답 섹션 DTO. FastAPI camelCase 출력과 Java 필드명 일치 — @JsonProperty 불필요.
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
@Schema(description = "AI 채팅 응답 섹션")
public class ChatSection {

    @Schema(description = "섹션 타입 — strength | improvement | action")
    private String type;

    @Schema(description = "섹션 제목")
    private String title;

    @Schema(description = "섹션 본문 (3~5문장)")
    private String text;
}
