package com.miriart.api.domain.chat;

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
import com.miriart.api.global.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
 * GET /api/chat/sessions — 세션 목록 API 통합 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ChatSessionControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    @Autowired ChatSessionRepository chatSessionRepository;
    @Autowired AnalysisRepository analysisRepository;

    private User user;
    private User otherUser;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("chat-session-test-" + UUID.randomUUID())
                .email("chat-session@test.com")
                .build());
        otherUser = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("chat-session-other-" + UUID.randomUUID())
                .email("chat-session-other@test.com")
                .build());
    }

    private String bearer(User u) {
        return "Bearer " + jwtUtil.createAccessToken(u.getId(), "USER");
    }

    private ChatSession createSession(User owner, String title) {
        ChatSession session = ChatSession.builder()
                .user(owner)
                .sessionKey(UUID.randomUUID().toString())
                .title(title)
                .build();
        return chatSessionRepository.save(session);
    }

    @Test
    @DisplayName("GET /api/chat/sessions — 200, 자기 세션만 반환")
    void getSessionList_returns_own_sessions() throws Exception {
        createSession(user, "내 채팅 1");
        createSession(user, "내 채팅 2");
        createSession(otherUser, "타인의 채팅");

        String json = mockMvc.perform(get("/api/chat/sessions")
                        .header(HttpHeaders.AUTHORIZATION, bearer(user))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        JsonNode content = data.path("content");
        assertThat(content.isArray()).isTrue();

        // 자기 세션만 포함, 타인 세션 미포함
        boolean hasOther = false;
        for (JsonNode node : content) {
            if ("타인의 채팅".equals(node.path("title").asText())) {
                hasOther = true;
            }
        }
        assertThat(hasOther).isFalse();

        // 최소 2개 (이번 테스트에서 생성한 것)
        long myCount = 0;
        for (JsonNode node : content) {
            String title = node.path("title").asText();
            if (title.startsWith("내 채팅")) myCount++;
        }
        assertThat(myCount).isGreaterThanOrEqualTo(2);
    }

    @Test
    @DisplayName("GET /api/chat/sessions — 응답 필드 구조 검증")
    void getSessionList_response_structure() throws Exception {
        ChatSession session = createSession(user, "구조 검증 세션");
        session.applyMessage(ChatRole.USER, "안녕");
        session.applyMessage(ChatRole.MODEL, "안녕하세요!");
        chatSessionRepository.save(session);

        String json = mockMvc.perform(get("/api/chat/sessions")
                        .header(HttpHeaders.AUTHORIZATION, bearer(user))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode content = objectMapper.readTree(json).path("data").path("content");
        JsonNode target = null;
        for (JsonNode node : content) {
            if ("구조 검증 세션".equals(node.path("title").asText())) {
                target = node;
                break;
            }
        }
        assertThat(target).isNotNull();
        assertThat(target.has("id")).isTrue();
        assertThat(target.has("sessionKey")).isTrue();
        assertThat(target.path("title").asText()).isEqualTo("구조 검증 세션");
        assertThat(target.path("lastMessage").asText()).isEqualTo("안녕하세요!");
        assertThat(target.path("messageCount").asInt()).isEqualTo(2);
        assertThat(target.has("createdAt")).isTrue();
        assertThat(target.has("updatedAt")).isTrue();
    }

    @Test
    @DisplayName("GET /api/chat/sessions?grade=A — grade 필터")
    void getSessionList_grade_filter() throws Exception {
        // 분석 기반 세션 (grade A)
        Analysis analysisA = analysisRepository.save(Analysis.builder()
                .user(user)
                .gcsUrl("gs://test/grade-a.png")
                .imageUrl("https://test/grade-a.png")
                .analysisType("PRACTICAL")
                .build());
        analysisA.complete(AnalysisGrade.A, 85.0, "{}", FixScope.DetailTuning, "좋아", "[]");
        analysisRepository.save(analysisA);

        ChatSession gradeASession = ChatSession.builder()
                .user(user)
                .analysis(analysisA)
                .sessionKey(UUID.randomUUID().toString())
                .title("A등급 분석 채팅")
                .build();
        chatSessionRepository.save(gradeASession);

        // 자유 채팅 (analysis 없음)
        createSession(user, "자유 채팅");

        String json = mockMvc.perform(get("/api/chat/sessions")
                        .param("grade", "A")
                        .header(HttpHeaders.AUTHORIZATION, bearer(user))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode content = objectMapper.readTree(json).path("data").path("content");

        // grade=A 필터 → 자유 채팅 미포함
        boolean hasFreeChat = false;
        for (JsonNode node : content) {
            if ("자유 채팅".equals(node.path("title").asText())) {
                hasFreeChat = true;
            }
        }
        assertThat(hasFreeChat).isFalse();
    }

    @Test
    @DisplayName("GET /api/chat/sessions — 페이징 파라미터 동작")
    void getSessionList_pagination() throws Exception {
        for (int i = 0; i < 3; i++) {
            createSession(user, "페이징 " + i);
        }

        String json = mockMvc.perform(get("/api/chat/sessions")
                        .param("page", "0")
                        .param("size", "2")
                        .header(HttpHeaders.AUTHORIZATION, bearer(user))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode data = objectMapper.readTree(json).path("data");
        assertThat(data.path("size").asInt()).isEqualTo(2);
        assertThat(data.path("content").size()).isLessThanOrEqualTo(2);
    }

    @Test
    @DisplayName("GET /api/chat/sessions — 인증 없이 접근 시 401")
    void getSessionList_unauthorized() throws Exception {
        mockMvc.perform(get("/api/chat/sessions")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
