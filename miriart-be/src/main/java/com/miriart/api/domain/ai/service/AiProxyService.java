package com.miriart.api.domain.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.ai.dto.*;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

/**
 * FastAPI AI 서비스와의 내부 통신을 담당하는 프록시 서비스.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link com.miriart.api.global.config.WebClientConfig}에서 주입된 WebClient로 {@code /internal/ai/analyze}, {@code /internal/ai/chat} 호출</li>
 *   <li>{@link com.miriart.api.global.redis.RedisService}를 통해 사용자별 채팅 세션 이력(72시간 TTL) JSON 저장·갱신</li>
 *   <li>{@link AiChatController}에서 chat 호출, {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 analyze 호출</li>
 * </ul>
 *
 * <p>Bug #4: Redis 세션에 전체 메시지 JSON 저장. Phase 1: FE history 전달 + BE Redis 보완 저장.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiProxyService {

    private static final int AI_TIMEOUT_SECONDS = 60;

    private final WebClient fastapiWebClient;
    private final RedisService redisService;
    private final ObjectMapper objectMapper;

    /**
     * 작품 분석 요청 (FastAPI /internal/ai/analyze)
     */
    public InternalAnalyzeResponse analyze(String gcsUrl, String analysisType, String problemText) {
        InternalAnalyzeRequest request = InternalAnalyzeRequest.builder()
                .gcsUri(gcsUrl)
                .analysisType(analysisType)
                .problemText(problemText)
                .build();

        return fastapiWebClient.post()
                .uri("/internal/ai/analyze")
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.is5xxServerError() || status.value() == 400
                        || status.value() == 401 || status.value() == 403,
                        res -> res.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new BusinessException(
                                        AiErrorMapper.toErrorCode(res.statusCode(), parseAiErrorCode(body), true)))))
                .bodyToMono(InternalAnalyzeResponse.class)
                .timeout(Duration.ofSeconds(AI_TIMEOUT_SECONDS))
                .onErrorMap(TimeoutException.class,
                        e -> new BusinessException(ErrorCode.AI_ANALYSIS_TIMEOUT))
                .onErrorMap(BusinessException.class, e -> e)
                .onErrorMap(e -> !(e instanceof BusinessException),
                        e -> {
                            log.error("FastAPI 분석 호출 실패: {}", e.getMessage(), e);
                            return new BusinessException(ErrorCode.AI_ANALYSIS_FAILED);
                        })
                .block();
    }

    /**
     * AI 채팅 요청 (FastAPI /internal/ai/chat)
     * Phase 1 히스토리 전략:
     * - FE가 매 요청에 history 배열 포함 → FastAPI로 그대로 전달 (stateless 1차)
     * - BE는 Redis에 전체 메시지 이력을 JSON으로 저장 (stateful 보완)
     */
    public ChatResponse chat(ChatRequest chatRequest) {
        String sessionId = chatRequest.getSessionId() != null
                ? chatRequest.getSessionId()
                : UUID.randomUUID().toString();

        InternalChatRequest internalRequest = InternalChatRequest.builder()
                .modelType(chatRequest.getModelType())
                .message(chatRequest.getMessage())
                .stickyContext(chatRequest.getStickyContext())
                .history(chatRequest.getHistory())
                .imageBase64(chatRequest.getImageBase64())
                .imageMimeType(chatRequest.getImageMimeType())
                .build();

        InternalChatResponse response = fastapiWebClient.post()
                .uri("/internal/ai/chat")
                .bodyValue(internalRequest)
                .retrieve()
                .onStatus(status -> status.is5xxServerError() || status.value() == 400
                        || status.value() == 401 || status.value() == 403,
                        res -> res.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new BusinessException(
                                        AiErrorMapper.toErrorCode(res.statusCode(), parseAiErrorCode(body), false)))))
                .bodyToMono(InternalChatResponse.class)
                .timeout(Duration.ofSeconds(AI_TIMEOUT_SECONDS))
                .onErrorMap(TimeoutException.class,
                        e -> new BusinessException(ErrorCode.AI_CHAT_TIMEOUT))
                .onErrorMap(BusinessException.class, e -> e)
                .onErrorMap(e -> !(e instanceof BusinessException),
                        e -> {
                            log.error("FastAPI 채팅 호출 실패: {}", e.getMessage(), e);
                            return new BusinessException(ErrorCode.AI_CHAT_FAILED);
                        })
                .block();

        // Redis 세션 업데이트 — 전체 메시지 이력을 JSON으로 저장 (Bug #4 Fix)
        if (response != null) {
            updateSessionHistory(sessionId, chatRequest, response);
        }

        return ChatResponse.builder()
                .text(response != null ? response.getText() : "")
                .groundingUrls(response != null ? response.getGroundingUrls() : List.of())
                .quickReplies(response != null ? response.getQuickReplies() : List.of())
                .sessionId(sessionId)
                .build();
    }

    /**
     * Redis에 채팅 세션 히스토리를 완전한 JSON으로 저장 (Bug #4 Fix)
     * 저장 형식: [ {"role":"user","text":"..."}, {"role":"model","text":"..."}, ... ]
     */
    @SuppressWarnings("unchecked")
    private void updateSessionHistory(String sessionId, ChatRequest request, InternalChatResponse response) {
        try {
            // 기존 히스토리 로드
            List<Map<String, String>> history = new ArrayList<>();
            String existing = redisService.getChatSession(sessionId);
            if (existing != null) {
                history = objectMapper.readValue(existing,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));
            }

            // 사용자 메시지 추가
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("text", request.getMessage());
            history.add(userMsg);

            // 모델 응답 추가
            Map<String, String> modelMsg = new HashMap<>();
            modelMsg.put("role", "model");
            modelMsg.put("text", response.getText());
            history.add(modelMsg);

            redisService.updateChatSession(sessionId, objectMapper.writeValueAsString(history));

        } catch (JsonProcessingException e) {
            log.warn("채팅 세션 히스토리 저장 실패 - sessionId: {}, error: {}", sessionId, e.getMessage());
        }
    }

    /**
     * AI 에러 응답 body에서 code 필드 추출. 파싱 실패 시 null.
     */
    private String parseAiErrorCode(String bodyStr) {
        if (bodyStr == null || bodyStr.isBlank()) return null;
        try {
            AiErrorResponse err = objectMapper.readValue(bodyStr, AiErrorResponse.class);
            return err != null ? err.getCode() : null;
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
