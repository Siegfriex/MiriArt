package com.miriart.api.domain.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.auth.oauth2.OAuth2AuthCodePayload;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * 인증·토큰 플로우 통합 테스트 (CTO 최소 스모크).
 * POST /api/auth/token, /api/auth/refresh, /api/auth/logout happy path 및 ErrorCode 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    private static final String REDIS_KEY_PREFIX = "miriart:oauth2:code:";

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    StringRedisTemplate redisTemplate;
    @Autowired
    UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("test-" + UUID.randomUUID())
                        .email("auth-test@example.com")
                        .build()
        );
    }

    @Test
    @DisplayName("POST /api/auth/token - 정상 code → access/refresh 발급, Set-Cookie 확인")
    void exchangeToken_success() throws Exception {
        String code = UUID.randomUUID().toString();
        String payloadJson = OAuth2AuthCodePayload.of(testUser.getId(), testUser.getEmail(), "KAKAO").toJson();
        redisTemplate.opsForValue().set(REDIS_KEY_PREFIX + code, payloadJson, 60, TimeUnit.SECONDS);

        ResultActions result = mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"code":"%s"}
                                """.formatted(code)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("refreshToken"));

        String json = result.andReturn().getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        assertThat(root.path("success").asBoolean()).isTrue();
        assertThat(root.path("data").path("accessToken").isMissingNode()).isFalse();
        assertThat(root.path("data").path("userId").asText()).isEqualTo(String.valueOf(testUser.getId()));
    }

    @Test
    @DisplayName("POST /api/auth/token - 잘못된 code → 400, AUTH002")
    void exchangeToken_invalidCode_returnsAUTH002() throws Exception {
        mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"code":"invalid-code"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("AUTH002"));
    }

    @Test
    @DisplayName("POST /api/auth/refresh - 유효 refresh 쿠키 → 새 access 발급")
    void refreshToken_success() throws Exception {
        // 1) token 교환으로 refresh 쿠키 확보
        String code = UUID.randomUUID().toString();
        String payloadJson = OAuth2AuthCodePayload.of(testUser.getId(), testUser.getEmail(), "KAKAO").toJson();
        redisTemplate.opsForValue().set(REDIS_KEY_PREFIX + code, payloadJson, 60, TimeUnit.SECONDS);

        String cookie = mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"" + code + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie("refreshToken").getValue();

        // 2) refresh로 새 access 발급
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", cookie)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists());
    }

    @Test
    @DisplayName("POST /api/auth/logout - 인증 있음 → 204, Redis refresh 삭제")
    void logout_withAuth_returns204() throws Exception {
        String code = UUID.randomUUID().toString();
        String payloadJson = OAuth2AuthCodePayload.of(testUser.getId(), testUser.getEmail(), "KAKAO").toJson();
        redisTemplate.opsForValue().set(REDIS_KEY_PREFIX + code, payloadJson, 60, TimeUnit.SECONDS);

        ResultActions tokenResult = mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"" + code + "\"}"));
        String accessToken = objectMapper.readTree(tokenResult.andReturn().getResponse().getContentAsString())
                .path("data").path("accessToken").asText();
        String refreshCookie = tokenResult.andReturn().getResponse().getCookie("refreshToken").getValue();

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + accessToken)
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshCookie)))
                .andExpect(status().isNoContent());

        // Redis refresh 삭제 여부: 동일 쿠키로 refresh 시도 시 실패
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshCookie)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/logout - 인증 없음(쿠키만) → 204")
    void logout_withoutAuth_returns204() throws Exception {
        String code = UUID.randomUUID().toString();
        String payloadJson = OAuth2AuthCodePayload.of(testUser.getId(), testUser.getEmail(), "KAKAO").toJson();
        redisTemplate.opsForValue().set(REDIS_KEY_PREFIX + code, payloadJson, 60, TimeUnit.SECONDS);
        String refreshCookie = mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"" + code + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie("refreshToken").getValue();

        mockMvc.perform(post("/api/auth/logout")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshCookie)))
                .andExpect(status().isNoContent());
    }
}
