package com.miriart.api.domain.community;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
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
 * GET /api/posts — 피드 목록 (PostsFeedPageResponse 구조).
 * GET /api/posts/{id} — 상세 (PostDetailResponse 구조).
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
    @DisplayName("GET /api/posts - 200, PostsFeedPageResponse 구조 (posts + nextCursor)")
    void getPosts_returns200AndFeedPage() throws Exception {
        postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("P1 테스트 글")
                .content("본문")
                .build());

        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("size", "20")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        assertThat(data.path("posts").isArray()).isTrue();
        if (data.path("posts").size() > 0) {
            JsonNode first = data.path("posts").get(0);
            assertThat(first.path("title").asText()).isEqualTo("P1 테스트 글");
            assertThat(first.has("id")).isTrue();
            assertThat(first.has("type")).isTrue();
            assertThat(first.has("persona")).isTrue();
        }
    }

    @Test
    @DisplayName("GET /api/posts/{id} - 200, PostDetailResponse 구조")
    void getPost_returns200AndDetail() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("상세 테스트 글")
                .content("상세 본문")
                .build());

        ResultActions result = mockMvc.perform(get("/api/posts/" + post.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        JsonNode data = root.path("data");
        assertThat(data.path("title").asText()).isEqualTo("상세 테스트 글");
        assertThat(data.path("content").asText()).isEqualTo("상세 본문");
        assertThat(data.path("answers").isArray()).isTrue();
        assertThat(data.path("comments").isArray()).isTrue();
    }

    @Test
    @DisplayName("GET /api/posts?type=invalid - 400, C001 (잘못된 PostType)")
    void getPosts_invalidType_returns400C001() throws Exception {
        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("type", "invalid")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("code").asText()).isEqualTo("C001");
    }

    @Test
    @DisplayName("GET /api/posts?sort=popular - 인기순 정렬 → 200")
    void getPosts_sortPopular_returns200() throws Exception {
        postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("인기순 테스트")
                .content("본문")
                .build());

        mockMvc.perform(get("/api/posts")
                        .param("sort", "popular")
                        .param("size", "20")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/posts?type=QNA&grade=중1 - 필터 조합 → 200")
    void getPosts_typeAndGradeFilter_returns200() throws Exception {
        postRepository.save(Post.builder()
                .user(author)
                .type(PostType.QNA)
                .title("중1 수학 질문")
                .content("본문")
                .gradeScope("중1")
                .domainScope("수학")
                .build());

        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("type", "QNA")
                        .param("grade", "중1")
                        .param("size", "20")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
    }

    @Test
    @DisplayName("GET /api/posts?domain=수학 - 도메인 필터 → 200")
    void getPosts_domainFilter_returns200() throws Exception {
        postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("수학 도메인 글")
                .content("본문")
                .domainScope("수학")
                .build());

        mockMvc.perform(get("/api/posts")
                        .param("domain", "수학")
                        .param("size", "20")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/posts/99999 - 404, CM001")
    void getPost_notFound_returnsCM001() throws Exception {
        ResultActions result = mockMvc.perform(get("/api/posts/99999")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("code").asText()).isEqualTo("CM001");
    }
}
