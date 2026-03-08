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
 * POST /api/comments — 댓글 작성 Controller 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CommentControllerTest {

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
                        .providerUserId("comment-test-" + UUID.randomUUID())
                        .email("comment-test@example.com")
                        .build()
        );
        testPost = postRepository.save(
                Post.builder()
                        .user(testUser)
                        .type(PostType.FREE)
                        .title("댓글 테스트 글")
                        .content("본문")
                        .build()
        );
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/comments - 게시글 댓글 작성 → 201, CommentResponse")
    void createComment_forPost_returns201() throws Exception {
        String body = """
                {"parentType":"post","parentId":%d,"content":"테스트 댓글입니다"}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        assertThat(data.path("parentType").asText()).isEqualTo("post");
        assertThat(data.path("content").asText()).isEqualTo("테스트 댓글입니다");
        assertThat(data.has("persona")).isTrue();
        assertThat(data.has("createdAt")).isTrue();
    }

    @Test
    @DisplayName("POST /api/comments - 인증 없이 → 403")
    void createComment_noAuth_returns403() throws Exception {
        String body = """
                {"parentType":"post","parentId":%d,"content":"인증 없는 댓글"}
                """.formatted(testPost.getId());

        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/comments - content 빈값 → 400")
    void createComment_emptyContent_returns400() throws Exception {
        String body = """
                {"parentType":"post","parentId":%d,"content":""}
                """.formatted(testPost.getId());

        mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/comments - parentType 누락 → 400")
    void createComment_missingParentType_returns400() throws Exception {
        String body = """
                {"parentId":%d,"content":"parentType 없는 댓글"}
                """.formatted(testPost.getId());

        mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
