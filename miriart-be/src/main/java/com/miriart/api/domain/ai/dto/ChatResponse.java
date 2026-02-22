package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * POST /api/chat 응답 DTO (BE → FE). AI 멘토 응답 텍스트·퀵리플라이·세션 ID.
 *
 * <p>연계: FastAPI {@link InternalChatResponse}를 AiProxyService가 받아 sessionId를 붙여 이 DTO로 변환 → FE에 ApiResponse.success로 반환.</p>
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
}
