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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
        testUser = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("comment-test-" + UUID.randomUUID())
                .email("comment-test@example.com")
                .build());
        testPost = postRepository.save(Post.builder()
                .user(testUser)
                .type(PostType.FREE)
                .title("댓글 테스트용 게시글")
                .content("본문")
                .build());
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/comments - 댓글 생성 성공 → 201")
    void createComment_success() throws Exception {
        String body = """
                {"parentType":"post","parentId":%d,"content":"테스트 댓글"}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        assertThat(root.path("data").path("content").asText()).isEqualTo("테스트 댓글");
    }

    @Test
    @DisplayName("POST /api/comments - 인증 없음 → 401")
    void createComment_noAuth_returns401() throws Exception {
        String body = """
                {"parentType":"post","parentId":%d,"content":"테스트 댓글"}
                """.formatted(testPost.getId());

        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/comments - 빈 content → 400")
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
    @DisplayName("POST /api/comments - 잘못된 parentType → 400, C001")
    void createComment_invalidParentType_returns400() throws Exception {
        String body = """
                {"parentType":"INVALID","parentId":%d,"content":"테스트"}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("code").asText()).isEqualTo("C001");
    }

    @Test
    @DisplayName("PUT /api/comments/{id} - 수정 성공 → 200")
    void updateComment_success() throws Exception {
        // 먼저 댓글 생성
        String createBody = """
                {"parentType":"post","parentId":%d,"content":"원본 댓글"}
                """.formatted(testPost.getId());

        String createJson = mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long commentId = objectMapper.readTree(createJson).path("data").path("id").asLong();

        // 수정
        String updateBody = """
                {"parentType":"post","parentId":%d,"content":"수정된 댓글"}
                """.formatted(testPost.getId());

        ResultActions result = mockMvc.perform(put("/api/comments/" + commentId)
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        assertThat(objectMapper.readTree(json).path("data").path("content").asText())
                .isEqualTo("수정된 댓글");
    }

    @Test
    @DisplayName("DELETE /api/comments/{id} - 삭제 성공 → 204")
    void deleteComment_success() throws Exception {
        // 먼저 댓글 생성
        String createBody = """
                {"parentType":"post","parentId":%d,"content":"삭제할 댓글"}
                """.formatted(testPost.getId());

        String createJson = mockMvc.perform(post("/api/comments")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long commentId = objectMapper.readTree(createJson).path("data").path("id").asLong();

        // 삭제
        mockMvc.perform(delete("/api/comments/" + commentId)
                        .header(HttpHeaders.AUTHORIZATION, bearer()))
                .andExpect(status().isNoContent());
    }
}
