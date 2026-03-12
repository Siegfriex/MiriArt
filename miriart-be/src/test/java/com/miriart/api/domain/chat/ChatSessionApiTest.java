package com.miriart.api.domain.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.entity.AnalysisGrade;
import com.miriart.api.domain.analysis.entity.FixScope;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.chat.entity.ChatRole;
import com.miriart.api.domain.chat.entity.ChatSession;
import com.miriart.api.domain.chat.repository.ChatSessionRepository;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.redis.RedisService;
import com.miriart.api.global.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 세션 메타/히스토리 API 통합 테스트 (3단계 신규 엔드포인트).
 */
@SpringBootTest
@AutoConfigureMockMvc
class ChatSessionApiTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    @Autowired ChatSessionRepository chatSessionRepository;
    @Autowired AnalysisRepository analysisRepository;
    @Autowired RedisService redisService;

    private User user;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("session-api-test-" + UUID.randomUUID())
                .email("session-api@test.com")
                .build());
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(user.getId(), "USER");
    }

    // ── GET /api/chat/sessions?analysisId=xxx ──────────────────────────

    @Test
    @DisplayName("GET ?analysisId → 200, 세션 생성 후 sessionKey 반환")
    void getOrCreate_creates_session() throws Exception {
        Analysis analysis = createAnalysis();

        String json = mockMvc.perform(get("/api/chat/sessions")
                        .param("analysisId", analysis.getId().toString())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.path("sessionKey").asText()).isNotBlank();
        assertThat(data.path("analysisId").asLong()).isEqualTo(analysis.getId());
        assertThat(data.path("modelType").asText()).isEqualTo("CHAT_PRO");
        assertThat(data.path("title").asText()).contains("분석 채팅");
    }

    @Test
    @DisplayName("GET ?analysisId → 같은 analysisId 재호출 시 동일 세션 반환")
    void getOrCreate_reuses_session() throws Exception {
        Analysis analysis = createAnalysis();

        String json1 = mockMvc.perform(get("/api/chat/sessions")
                        .param("analysisId", analysis.getId().toString())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String json2 = mockMvc.perform(get("/api/chat/sessions")
                        .param("analysisId", analysis.getId().toString())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String key1 = objectMapper.readTree(json1).path("data").path("sessionKey").asText();
        String key2 = objectMapper.readTree(json2).path("data").path("sessionKey").asText();
        assertThat(key1).isEqualTo(key2);
    }

    @Test
    @DisplayName("GET ?analysisId=999999 → 404 AN003")
    void getOrCreate_notFound() throws Exception {
        String json = mockMvc.perform(get("/api/chat/sessions")
                        .param("analysisId", "999999")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readTree(json).path("code").asText()).isEqualTo("AN003");
    }

    // ── GET /api/chat/sessions/{sessionKey} ─────────────────────────────

    @Test
    @DisplayName("GET /{sessionKey} → 200, 세션 메타 반환")
    void getBySessionKey_ok() throws Exception {
        ChatSession session = createSession("테스트 세션");

        String json = mockMvc.perform(get("/api/chat/sessions/" + session.getSessionKey())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.path("sessionKey").asText()).isEqualTo(session.getSessionKey());
        assertThat(data.path("title").asText()).isEqualTo("테스트 세션");
    }

    @Test
    @DisplayName("GET /{sessionKey} → 존재하지 않는 키 → 404 CS001")
    void getBySessionKey_notFound() throws Exception {
        String json = mockMvc.perform(get("/api/chat/sessions/" + UUID.randomUUID())
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readTree(json).path("code").asText()).isEqualTo("CS001");
    }

    // ── GET /api/chat/sessions/{sessionKey}/messages ────────────────────

    @Test
    @DisplayName("GET /{sessionKey}/messages → 200, Redis 히스토리 반환")
    void getMessages_ok() throws Exception {
        ChatSession session = createSession("히스토리 세션");

        // Redis에 히스토리 저장
        String historyJson = "[{\"role\":\"user\",\"text\":\"안녕\"},{\"role\":\"model\",\"text\":\"안녕하세요!\"}]";
        redisService.saveChatSession(session.getSessionKey(), historyJson);

        String json = mockMvc.perform(get("/api/chat/sessions/" + session.getSessionKey() + "/messages")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.isArray()).isTrue();
        assertThat(data.size()).isEqualTo(2);
        assertThat(data.get(0).path("sender").asText()).isEqualTo("USER");
        assertThat(data.get(0).path("content").asText()).isEqualTo("안녕");
        assertThat(data.get(1).path("sender").asText()).isEqualTo("AI");
        assertThat(data.get(1).path("content").asText()).isEqualTo("안녕하세요!");
        assertThat(data.get(0).path("type").asText()).isEqualTo("TEXT");
    }

    @Test
    @DisplayName("GET /{sessionKey}/messages → Redis 비어있으면 빈 배열")
    void getMessages_empty() throws Exception {
        ChatSession session = createSession("빈 세션");

        String json = mockMvc.perform(get("/api/chat/sessions/" + session.getSessionKey() + "/messages")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.isArray()).isTrue();
        assertThat(data.size()).isEqualTo(0);
    }

    @Test
    @DisplayName("GET /{unknownKey}/messages → 404 CS001")
    void getMessages_sessionNotFound() throws Exception {
        mockMvc.perform(get("/api/chat/sessions/" + UUID.randomUUID() + "/messages")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private Analysis createAnalysis() {
        Analysis analysis = analysisRepository.save(Analysis.builder()
                .user(user)
                .gcsUrl("gs://test/api-test-" + UUID.randomUUID() + ".png")
                .imageUrl("https://test/api-test.png")
                .analysisType("PRACTICAL")
                .build());
        analysis.complete(AnalysisGrade.B, 72.0, "{}", FixScope.DetailTuning, "괜찮은 작품", "[]");
        return analysisRepository.save(analysis);
    }

    private ChatSession createSession(String title) {
        ChatSession session = ChatSession.builder()
                .user(user)
                .sessionKey(UUID.randomUUID().toString())
                .title(title)
                .build();
        session.applyMessage(ChatRole.USER, "테스트");
        session.applyMessage(ChatRole.MODEL, "응답");
        return chatSessionRepository.save(session);
    }
}
