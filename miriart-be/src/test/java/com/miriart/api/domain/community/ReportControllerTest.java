package com.miriart.api.domain.community;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.repository.PostRepository;
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
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * POST /api/posts/{id}/report — 신고 Controller 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ReportControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    @Autowired PostRepository postRepository;

    private User testUser;
    private Post testPost;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("report-test-" + UUID.randomUUID())
                        .email("report-test@example.com")
                        .build()
        );
        testPost = postRepository.save(
                Post.builder()
                        .user(testUser)
                        .type(PostType.FREE)
                        .title("신고 테스트 글")
                        .content("본문")
                        .build()
        );
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/posts/{id}/report - 신고 성공 → 201")
    void reportPost_returns201() throws Exception {
        String body = """
                {"reason":"부적절한 내용"}
                """;

        mockMvc.perform(post("/api/posts/" + testPost.getId() + "/report")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/posts/{id}/report - reason 없이도 신고 가능 → 201")
    void reportPost_noReason_returns201() throws Exception {
        mockMvc.perform(post("/api/posts/" + testPost.getId() + "/report")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/posts/{id}/report - 중복 신고 → 409, CM007")
    void reportPost_duplicate_returns409() throws Exception {
        String body = """
                {"reason":"첫 번째 신고"}
                """;

        // 첫 번째 신고
        mockMvc.perform(post("/api/posts/" + testPost.getId() + "/report")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        // 중복 신고
        ResultActions result = mockMvc.perform(post("/api/posts/" + testPost.getId() + "/report")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("code").asText()).isEqualTo("CM007");
    }

    @Test
    @DisplayName("POST /api/posts/{id}/report - 인증 없이 → 403")
    void reportPost_noAuth_returns403() throws Exception {
        mockMvc.perform(post("/api/posts/" + testPost.getId() + "/report")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
