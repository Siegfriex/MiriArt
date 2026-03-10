package com.miriart.api.domain.ai;

import com.miriart.api.domain.ai.dto.ChatRequest;
import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.redis.RedisService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

import com.github.tomakehurst.wiremock.WireMockServer;

/**
 * AiProxyService ↔ AI 스텁(WireMock) 통합/계약 테스트.
 * SSOT 에러 매핑: 504→AN002/AI002, 502+GCS_ERROR→F005, 502+LLM_*→AN001/AI001, 400+VALIDATION_ERROR→C001.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("dev")
class AiProxyServiceIntegrationTest {

    static final WireMockServer wireMock = new WireMockServer(wireMockConfig().dynamicPort());

    @BeforeAll
    static void startWireMock() {
        wireMock.start();
    }

    @AfterAll
    static void stopWireMock() {
        wireMock.stop();
    }

    @DynamicPropertySource
    static void setFastApiUrl(DynamicPropertyRegistry registry) {
        registry.add("miriart.fastapi.internal-url", () -> "http://localhost:" + wireMock.port());
    }

    @Autowired
    AiProxyService aiProxyService;

    @MockBean
    RedisService redisService;

    @MockBean
    ClientRegistrationRepository clientRegistrationRepository;

    @BeforeEach
    void setUp() {
        wireMock.resetAll();
        when(redisService.getChatSession(org.mockito.ArgumentMatchers.anyString())).thenReturn(null);
    }

    private static final String ANALYZE_SUCCESS_BODY = """
            {"grade":"A","totalScore":85.5,"radarData":{"density":85,"form":80,"completion":78,"relevance":88,"thinking":79},"fixScope":"DetailTuning","comment":"테스트","universityPredictions":[]}
            """;
    private static final String CHAT_SUCCESS_BODY = """
            {"text":"안녕하세요.","groundingUrls":[],"quickReplies":["추천","분석","다른 질문"]}
            """;

    @Test
    @DisplayName("analyze - AI 200 → 성공, InternalAnalyzeResponse 반환")
    void analyze_success_returnsResponse() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody(ANALYZE_SUCCESS_BODY)));

        InternalAnalyzeResponse result = aiProxyService.analyze("gs://bucket/art.jpg", "basic", null);

        assertThat(result).isNotNull();
        assertThat(result.getGrade()).isEqualTo("A");
        assertThat(result.getTotalScore()).isEqualTo(85.5);
        assertThat(result.getRadarData()).isNotNull();
    }

    @Test
    @DisplayName("analyze - AI 504 + LLM_TIMEOUT → AN002")
    void analyze_504LlmTimeout_mapsToAN002() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(504)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"LLM_TIMEOUT\",\"message\":\"timeout\"}")));

        assertThatThrownBy(() -> aiProxyService.analyze("gs://b/k", "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_ANALYSIS_TIMEOUT));
    }

    @Test
    @DisplayName("analyze - AI 502 + GCS_ERROR → F005")
    void analyze_502GcsError_mapsToF005() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(502)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"GCS_ERROR\",\"message\":\"GCS failed\"}")));

        assertThatThrownBy(() -> aiProxyService.analyze("gs://b/k", "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("analyze - AI 502 + LLM_SERVICE_ERROR → AN001")
    void analyze_502LlmServiceError_mapsToAN001() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(502)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"LLM_SERVICE_ERROR\",\"message\":\"Gemini error\"}")));

        assertThatThrownBy(() -> aiProxyService.analyze("gs://b/k", "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_ANALYSIS_FAILED));
    }

    @Test
    @DisplayName("analyze - AI 400 + VALIDATION_ERROR → C001")
    void analyze_400ValidationError_mapsToC001() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(400)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"VALIDATION_ERROR\",\"message\":\"invalid input\"}")));

        assertThatThrownBy(() -> aiProxyService.analyze("gs://b/k", "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.INVALID_INPUT_VALUE));
    }

    @Test
    @DisplayName("chat - AI 200 → 성공, ChatResponse 반환")
    void chat_success_returnsResponse() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody(CHAT_SUCCESS_BODY)));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "안녕");
        var result = aiProxyService.chat(req);

        assertThat(result).isNotNull();
        assertThat(result.getText()).isEqualTo("안녕하세요.");
        assertThat(result.getSessionId()).isNotNull();
    }

    @Test
    @DisplayName("chat - AI 504 + LLM_TIMEOUT → AI002")
    void chat_504LlmTimeout_mapsToAI002() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(504)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"LLM_TIMEOUT\",\"message\":\"timeout\"}")));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "hello");
        assertThatThrownBy(() -> aiProxyService.chat(req))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_CHAT_TIMEOUT));
    }

    @Test
    @DisplayName("chat - AI 502 + GCS_ERROR → F005")
    void chat_502GcsError_mapsToF005() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(502)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"GCS_ERROR\",\"message\":\"GCS failed\"}")));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "hello");
        assertThatThrownBy(() -> aiProxyService.chat(req))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED));
    }

    @Test
    @DisplayName("chat - AI 502 + LLM_SERVICE_ERROR → AI001")
    void chat_502LlmServiceError_mapsToAI001() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(502)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"LLM_SERVICE_ERROR\",\"message\":\"error\"}")));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "hello");
        assertThatThrownBy(() -> aiProxyService.chat(req))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_CHAT_FAILED));
    }

    @Test
    @DisplayName("chat - AI 400 + VALIDATION_ERROR → C001")
    void chat_400ValidationError_mapsToC001() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(400)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"code\":\"VALIDATION_ERROR\",\"message\":\"invalid\"}")));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "hello");
        assertThatThrownBy(() -> aiProxyService.chat(req))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.INVALID_INPUT_VALUE));
    }

    // ── 401/403 Cloud Run IAM 인증 실패 ──────────────────────────────────────

    @Test
    @DisplayName("analyze - AI 403 → AI003 (AI_SERVICE_AUTH_FAILED)")
    void analyze_403_mapsToAI003() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/analyze"))
                .willReturn(aResponse()
                        .withStatus(403)
                        .withHeader("Content-Type", "text/html")
                        .withBody("<html><body>Your client does not have permission</body></html>")));

        assertThatThrownBy(() -> aiProxyService.analyze("gs://b/k", "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_SERVICE_AUTH_FAILED));
    }

    @Test
    @DisplayName("chat - AI 403 → AI003 (AI_SERVICE_AUTH_FAILED)")
    void chat_403_mapsToAI003() {
        wireMock.stubFor(post(urlPathEqualTo("/internal/ai/chat"))
                .willReturn(aResponse()
                        .withStatus(403)
                        .withHeader("Content-Type", "text/html")
                        .withBody("<html><body>Your client does not have permission</body></html>")));

        ChatRequest req = new ChatRequest();
        ReflectionTestUtils.setField(req, "message", "hello");
        assertThatThrownBy(() -> aiProxyService.chat(req))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.AI_SERVICE_AUTH_FAILED));
    }
}
