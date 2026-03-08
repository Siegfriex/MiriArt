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
 * POST /api/likes/toggle — 좋아요 토글 Controller 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class LikeControllerTest {

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
                        .providerUserId("like-test-" + UUID.randomUUID())
                        .email("like-test@example.com")
                        .build()
        );
        testPost = postRepository.save(
                Post.builder()
                        .user(testUser)
                        .type(PostType.FREE)
                        .title("좋아요 테스트 글")
                        .content("본문")
                        .build()
        );
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/likes/toggle - 잘못된 targetType → 400, C001")
    void toggle_invalidTargetType_returns400C001() throws Exception {
        String body = """
                {"targetType":"INVALID","targetId":%d}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(post("/api/likes/toggle")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("code").asText()).isEqualTo("C001");
    }

    @Test
    @DisplayName("POST /api/likes/toggle - 유효한 targetType → 200, {liked, likeCount}")
    void toggle_validTargetType_returns200WithLikedAndCount() throws Exception {
        String body = """
                {"targetType":"POST","targetId":%d}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(post("/api/likes/toggle")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        assertThat(data.has("liked")).isTrue();
        assertThat(data.path("liked").asBoolean()).isTrue();
        assertThat(data.has("likeCount")).isTrue();
        assertThat(data.path("likeCount").asInt()).isEqualTo(1);
    }
}
