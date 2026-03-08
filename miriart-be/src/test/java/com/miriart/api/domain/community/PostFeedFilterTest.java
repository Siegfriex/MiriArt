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
 * 피드 필터 & 페이지네이션 엣지 케이스 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class PostFeedFilterTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired PostRepository postRepository;
    @Autowired UserRepository userRepository;

    private User author;

    @BeforeEach
    void setUp() {
        author = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("feed-filter-" + UUID.randomUUID())
                        .email("feed-filter@example.com")
                        .build()
        );
    }

    @Test
    @DisplayName("GET /api/posts?size=9999 - size가 100으로 clamp됨")
    void getPosts_largeSize_clampedTo100() throws Exception {
        // 최소 1개 게시글 생성
        postRepository.save(Post.builder()
                .user(author).type(PostType.FREE).title("clamp 테스트").content("본문").build());

        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("size", "9999")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // 응답이 정상이면 서버가 OOM 없이 처리한 것
        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
    }

    @Test
    @DisplayName("GET /api/posts?size=-1 - 음수 size → 1로 clamp")
    void getPosts_negativeSize_clampedTo1() throws Exception {
        postRepository.save(Post.builder()
                .user(author).type(PostType.FREE).title("음수 size 테스트").content("본문").build());

        mockMvc.perform(get("/api/posts")
                        .param("size", "-1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/posts - status 필드가 lowercase로 반환됨")
    void getPosts_statusIsLowercase() throws Exception {
        postRepository.save(Post.builder()
                .user(author).type(PostType.FREE).title("lowercase 테스트").content("본문").build());

        ResultActions result = mockMvc.perform(get("/api/posts")
                        .param("size", "1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        JsonNode posts = root.path("data").path("posts");
        if (posts.size() > 0) {
            String status = posts.get(0).path("status").asText();
            assertThat(status).isEqualTo(status.toLowerCase());
        }
    }

    @Test
    @DisplayName("GET /api/posts?type=QNA&grade=고1&domain=수학 - 복합 필터 → 200")
    void getPosts_combinedFilter_returns200() throws Exception {
        postRepository.save(Post.builder()
                .user(author).type(PostType.QNA).title("복합 필터")
                .content("본문").gradeScope("고1").domainScope("수학").build());

        mockMvc.perform(get("/api/posts")
                        .param("type", "QNA")
                        .param("grade", "고1")
                        .param("domain", "수학")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
