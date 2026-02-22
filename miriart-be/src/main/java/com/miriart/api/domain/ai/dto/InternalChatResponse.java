package com.miriart.api.domain.ai.dto;

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
public class InternalChatResponse {

    private String text;
    private List<String> groundingUrls;
    private List<String> quickReplies;
}
