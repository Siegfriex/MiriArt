package com.miriart.api.domain.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.chat.dto.ChatMessageDto;
import com.miriart.api.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Redis 채팅 히스토리 조회 서비스.
 *
 * <p>Redis 저장 형식: [{@code {"role":"user","text":"..."}}, {@code {"role":"model","text":"..."}}]
 * → {@link ChatMessageDto} 리스트로 변환.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatHistoryService {

    private final RedisService redisService;
    private final ObjectMapper objectMapper;

    /**
     * Redis에서 세션 히스토리를 조회하여 DTO 리스트로 변환.
     *
     * @param sessionKey 세션 키 (UUID)
     * @param limit      최대 메시지 수 (0 이하면 전체)
     * @return 메시지 리스트 (Redis에 데이터가 없으면 빈 리스트)
     */
    @SuppressWarnings("unchecked")
    public List<ChatMessageDto> getRecentMessages(String sessionKey, int limit) {
        String raw = redisService.getChatSession(sessionKey);
        if (raw == null || raw.isBlank()) {
            return Collections.emptyList();
        }

        try {
            List<Map<String, String>> history = objectMapper.readValue(raw,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            List<Map<String, String>> target = (limit > 0 && history.size() > limit)
                    ? history.subList(history.size() - limit, history.size())
                    : history;

            List<ChatMessageDto> result = new ArrayList<>(target.size());
            long ts = System.currentTimeMillis();
            for (int i = 0; i < target.size(); i++) {
                Map<String, String> entry = target.get(i);
                String role = entry.getOrDefault("role", "user");
                String sender = "model".equals(role) ? "AI" : "USER";
                result.add(ChatMessageDto.builder()
                        .id(UUID.randomUUID().toString())
                        .sender(sender)
                        .type("TEXT")
                        .content(entry.getOrDefault("text", ""))
                        .timestamp(ts + i)
                        .build());
            }
            return result;

        } catch (JsonProcessingException e) {
            log.warn("채팅 히스토리 파싱 실패 - sessionKey: {}, error: {}", sessionKey, e.getMessage());
            return Collections.emptyList();
        }
    }
}
