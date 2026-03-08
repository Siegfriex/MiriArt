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

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AnswerControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    @Autowired PostRepository postRepository;

    private User testUser;
    private Post qnaPost;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("answer-test-" + UUID.randomUUID())
                .email("answer-test@example.com")
                .build());
        qnaPost = postRepository.save(Post.builder()
                .user(testUser)
                .type(PostType.QNA)
                .title("QnA 테스트 질문")
                .content("질문 본문")
                .deadlineAt(LocalDateTime.now().plusHours(24))
                .build());
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    private String bearer(User user) {
        return "Bearer " + jwtUtil.createAccessToken(user.getId(), "USER");
    }

    @Test
    @DisplayName("POST /api/posts/{postId}/answers - 답변 생성 성공 → 201")
    void createAnswer_success() throws Exception {
        // 답변 작성자는 질문자와 다른 사용자
        User answerer = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("answerer-" + UUID.randomUUID())
                .email("answerer@example.com")
                .build());

        String body = """
                {"content":"테스트 답변입니다"}
                """;

        ResultActions result = mockMvc.perform(post("/api/posts/" + qnaPost.getId() + "/answers")
                        .header(HttpHeaders.AUTHORIZATION, bearer(answerer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        assertThat(root.path("data").asLong()).isGreaterThan(0);
    }

    @Test
    @DisplayName("POST /api/posts/{postId}/answers - 인증 없음 → 401")
    void createAnswer_noAuth_returns401() throws Exception {
        mockMvc.perform(post("/api/posts/" + qnaPost.getId() + "/answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"인증 없는 답변"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/posts/{postId}/answers - FREE 게시글에 답변 불가 → 400")
    void createAnswer_freePost_returns400() throws Exception {
        Post freePost = postRepository.save(Post.builder()
                .user(testUser)
                .type(PostType.FREE)
                .title("자유 게시글")
                .content("본문")
                .build());

        mockMvc.perform(post("/api/posts/" + freePost.getId() + "/answers")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"자유게시글 답변 시도"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/posts/{postId}/answers - 빈 content → 400")
    void createAnswer_emptyContent_returns400() throws Exception {
        mockMvc.perform(post("/api/posts/" + qnaPost.getId() + "/answers")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/posts/{postId}/answers/{answerId} - 수정 성공 → 200")
    void updateAnswer_success() throws Exception {
        // 답변 생성
        String createJson = mockMvc.perform(post("/api/posts/" + qnaPost.getId() + "/answers")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"원본 답변"}
                                """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long answerId = objectMapper.readTree(createJson).path("data").asLong();

        // 수정
        mockMvc.perform(put("/api/posts/" + qnaPost.getId() + "/answers/" + answerId)
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"수정된 답변"}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("DELETE /api/posts/{postId}/answers/{answerId} - 삭제 성공 → 204")
    void deleteAnswer_success() throws Exception {
        // 답변 생성
        String createJson = mockMvc.perform(post("/api/posts/" + qnaPost.getId() + "/answers")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"content":"삭제할 답변"}
                                """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long answerId = objectMapper.readTree(createJson).path("data").asLong();

        // 삭제
        mockMvc.perform(delete("/api/posts/" + qnaPost.getId() + "/answers/" + answerId)
                        .header(HttpHeaders.AUTHORIZATION, bearer()))
                .andExpect(status().isNoContent());
    }
}
