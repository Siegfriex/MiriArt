package com.miriart.api.global.exception;

import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
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

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * GlobalExceptionHandler / ErrorCode 응답 포맷 검증 (CTO 최소 스모크).
 * 대표 비즈니스 에러 시 HTTP status, code, message가 정확히 내려오는지 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class GlobalExceptionHandlerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("error-test-" + UUID.randomUUID())
                        .email("error-test@example.com")
                        .build()
        );
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(testUser.getId(), "USER");
    }

    @Test
    @DisplayName("유효성 위반(빈 nickname 등) → 400, C001")
    void invalidInput_returnsC001() throws Exception {
        mockMvc.perform(patch("/api/users/me/profile")
                        .header(HttpHeaders.AUTHORIZATION, bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nickname":"","grade":"고1","domain":"기초디자인"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("C001"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("POST /api/auth/token - 잘못된 code → 400, AUTH002")
    void oauthCodeInvalid_returnsAUTH002() throws Exception {
        mockMvc.perform(post("/api/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"code":"invalid-or-expired-code"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("AUTH002"))
                .andExpect(jsonPath("$.message").value("유효하지 않거나 만료된 인가 코드입니다"));
    }
}
