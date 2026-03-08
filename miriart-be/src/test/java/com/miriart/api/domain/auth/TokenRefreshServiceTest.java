package com.miriart.api.domain.auth;

import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.redis.RedisService;
import com.miriart.api.global.security.JwtUtil;
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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;

/**
 * POST /api/auth/refresh — Token Refresh 테스트.
 */
@SpringBootTest
@AutoConfigureMockMvc
class TokenRefreshServiceTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtUtil jwtUtil;
    @Autowired RedisService redisService;
    @Autowired UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("refresh-test-" + UUID.randomUUID())
                        .email("refresh-test@example.com")
                        .build()
        );
    }

    @Test
    @DisplayName("POST /api/auth/refresh - 유효한 RT → 200 + 새 AT 발급 + Set-Cookie (RT 회전)")
    void refresh_validToken_returns200WithRotation() throws Exception {
        String refreshToken = jwtUtil.createRefreshToken(testUser.getId());
        redisService.saveRefreshToken(testUser.getId(), refreshToken);

        ResultActions result = mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        assertThat(root.path("data").path("accessToken").asText()).isNotEmpty();

        // Set-Cookie로 새 RT가 내려왔는지 확인
        String setCookie = result.andReturn().getResponse().getHeader("Set-Cookie");
        assertThat(setCookie).isNotNull();
        assertThat(setCookie).contains("refreshToken=");
        assertThat(setCookie).contains("HttpOnly");
    }

    @Test
    @DisplayName("POST /api/auth/refresh - RT 쿠키 없음 → 401")
    void refresh_noCookie_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/refresh - Redis 불일치 → 401")
    void refresh_redisMismatch_returns401() throws Exception {
        String refreshToken = jwtUtil.createRefreshToken(testUser.getId());
        // Redis에 다른 토큰 저장
        redisService.saveRefreshToken(testUser.getId(), "different-token");

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new Cookie("refreshToken", refreshToken))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
