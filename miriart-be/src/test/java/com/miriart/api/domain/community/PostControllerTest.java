package com.miriart.api.domain.community;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * P1: GET /api/posts 200, 페이지네이션·정렬. posts 스키마 사용 범위 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class PostControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    PostRepository postRepository;
    @Autowired
    UserRepository userRepository;

    private User author;

    @BeforeEach
    void setUp() {
        author = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("post-test-" + UUID.randomUUID())
                        .email("post-test@example.com")
                        .build()
        );
    }

    @Test
    @DisplayName("GET /api/posts - 200, 페이지 구조 및 Post 필드 매핑")
    void getPosts_returns200AndPageWithPostFields() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("P1 테스트 글")
                .content("본문")
                .build());

        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("size", "20")
                        .param("sort", "createdAt,desc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        assertThat(data.path("content").isArray()).isTrue();
        if (data.path("content").size() > 0) {
            JsonNode first = data.path("content").get(0);
            assertThat(first.path("title").asText()).isEqualTo("P1 테스트 글");
            assertThat(first.path("id").isMissingNode()).isFalse();
        }
    }
}
