package com.miriart.api.domain.ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * FastAPI POST /internal/ai/chat 응답 DTO. Python InternalChatResponse와 필드 대응.
 *
 * <p>연계: FastAPI가 반환한 JSON을 WebClient가 이 타입으로 역직렬화 → AiProxyService가 ChatResponse로 변환·Redis 세션 업데이트.</p>
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
@Schema(description = "FastAPI → BE 채팅 응답 내부 DTO")
public class InternalChatResponse {

    @Schema(description = "하위 호환용 텍스트 (sections가 있으면 join된 문자열, 없으면 단일 응답)")
    private String text;

    @Schema(description = "한 줄 핵심 요약 (50자 이내, optional)")
    private String summary;

    @Schema(
        description = "역할별 섹션 배열 (없으면 단일 버블 fallback)",
        example = "[{\"type\":\"strength\",\"title\":\"...\",\"text\":\"...\"}]"
    )
    private List<ChatSection> sections;

    private List<String> groundingUrls;
    private List<String> quickReplies;
}
