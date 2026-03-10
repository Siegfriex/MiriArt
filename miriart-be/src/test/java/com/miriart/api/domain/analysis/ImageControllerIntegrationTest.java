package com.miriart.api.domain.analysis;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.security.JwtUtil;
import com.miriart.api.global.storage.SignedImageUrl;
import com.miriart.api.global.storage.SignedUrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * GET /api/images/{id}/url 통합 테스트. 본인 id → 200, 타인/없는 id → 404 I001, SignedUrl 예외 → 502 F005.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ImageControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AnalysisRepository analysisRepository;
    @MockBean
    SignedUrlService signedUrlService;

    private User user1;
    private User user2;
    private Analysis analysis1;

    @BeforeEach
    void setUp() {
        user1 = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("img-u1-" + UUID.randomUUID())
                        .email("img1@example.com")
                        .build()
        );
        user2 = userRepository.save(
                User.builder()
                        .provider(LoginProvider.GOOGLE)
                        .providerUserId("img-u2-" + UUID.randomUUID())
                        .email("img2@example.com")
                        .build()
        );
        analysis1 = analysisRepository.save(
                Analysis.builder()
                        .user(user1)
                        .gcsUrl("gs://miriart-bucket/artworks/2026-03-10/f.jpg")
                        .imageUrl("https://storage.googleapis.com/miriart-bucket/artworks/2026-03-10/f.jpg")
                        .analysisType("basic")
                        .problemText(null)
                        .build()
        );
    }

    private String bearerForUser(long userId) {
        return "Bearer " + jwtUtil.createAccessToken(userId, "USER");
    }

    @Test
    @DisplayName("GET /api/images/{id}/url - 본인 분석 id → 200, url·expiresAt 존재")
    void getImageUrl_ownAnalysis_returns200WithUrlAndExpiresAt() throws Exception {
        when(signedUrlService.createSignedUrl(anyLong(), anyString()))
                .thenReturn(new SignedImageUrl("https://storage.googleapis.com/miriart-bucket/artworks/2026-03-10/f.jpg?X-Goog-Signature=test", Instant.now().plusSeconds(900)));

        mockMvc.perform(get("/api/images/" + analysis1.getId() + "/url")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user1.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.url").isNotEmpty())
                .andExpect(jsonPath("$.data.expiresAt").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/images/{id}/url - 없는 id → 404 I001")
    void getImageUrl_notFound_returns404I001() throws Exception {
        long nonExistent = 999_999L;
        mockMvc.perform(get("/api/images/" + nonExistent + "/url")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user1.getId())))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("I001"));
    }

    @Test
    @DisplayName("GET /api/images/{id}/url - 타인 분석 id → 404 I001")
    void getImageUrl_otherUserAnalysis_returns404I001() throws Exception {
        mockMvc.perform(get("/api/images/" + analysis1.getId() + "/url")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user2.getId())))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("I001"));
    }

    @Test
    @DisplayName("GET /api/images/{id}/url - SignedUrlService 예외 → 502 F005")
    void getImageUrl_signedUrlServiceThrows_returns502F005() throws Exception {
        when(signedUrlService.createSignedUrl(anyLong(), anyString()))
                .thenThrow(new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED));

        mockMvc.perform(get("/api/images/" + analysis1.getId() + "/url")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user1.getId())))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.code").value("F005"));
    }

    @Test
    @DisplayName("GET /api/images/{id}/url - 인증 없음 → 401")
    void getImageUrl_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/images/" + analysis1.getId() + "/url"))
                .andExpect(status().isUnauthorized());
    }
}
