package com.miriart.api.domain.community;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
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

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PostCommandServiceTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    @Autowired PostRepository postRepository;

    private User author;
    private User otherUser;

    @BeforeEach
    void setUp() {
        author = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("post-cmd-" + UUID.randomUUID())
                .email("post-cmd@example.com")
                .build());
        otherUser = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("post-cmd-other-" + UUID.randomUUID())
                .email("post-cmd-other@example.com")
                .build());
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.createAccessToken(user.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/posts - 게시글 생성 성공 → 201")
    void createPost_success() throws Exception {
        String body = """
                {"type":"FREE","title":"테스트 제목","content":"테스트 본문","isAnonymous":true}
                """;

        String json = mockMvc.perform(post("/api/posts")
                        .header(HttpHeaders.AUTHORIZATION, bearer(author))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        assertThat(root.path("data").path("title").asText()).isEqualTo("테스트 제목");
    }

    @Test
    @DisplayName("PUT /api/posts/{id} - 수정 성공 → 200")
    void updatePost_success() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author).type(PostType.FREE)
                .title("원본 제목").content("원본 본문").build());

        String body = """
                {"type":"FREE","title":"수정된 제목","content":"수정된 본문"}
                """;

        String json = mockMvc.perform(put("/api/posts/" + post.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(author))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertThat(objectMapper.readTree(json).path("data").path("title").asText())
                .isEqualTo("수정된 제목");
    }

    @Test
    @DisplayName("PUT /api/posts/{id} - 타인 게시글 수정 → 403")
    void updatePost_otherUser_returns403() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author).type(PostType.FREE)
                .title("원본").content("본문").build());

        String body = """
                {"type":"FREE","title":"수정 시도","content":"수정 시도"}
                """;

        mockMvc.perform(put("/api/posts/" + post.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(otherUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /api/posts/{id} - soft delete → 204, status=CLOSED")
    void deletePost_softDelete() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author).type(PostType.FREE)
                .title("삭제 테스트").content("본문").build());

        mockMvc.perform(delete("/api/posts/" + post.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(author)))
                .andExpect(status().isNoContent());

        Post updated = postRepository.findById(post.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(PostStatus.CLOSED);
    }

    @Test
    @DisplayName("DELETE /api/posts/{id} - 타인 게시글 삭제 → 403")
    void deletePost_otherUser_returns403() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author).type(PostType.FREE)
                .title("타인 삭제 시도").content("본문").build());

        mockMvc.perform(delete("/api/posts/" + post.getId())
                        .header(HttpHeaders.AUTHORIZATION, bearer(otherUser)))
                .andExpect(status().isForbidden());
    }
}
