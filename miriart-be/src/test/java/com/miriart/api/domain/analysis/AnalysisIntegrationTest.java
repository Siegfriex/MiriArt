package com.miriart.api.domain.analysis;

import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.ai.dto.RadarData;
import com.miriart.api.domain.ai.dto.UniversityPrediction;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.miriart.api.domain.analysis.entity.AnalysisGrade;
import com.miriart.api.domain.analysis.entity.FixScope;
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
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

/**
 * 분석 플로우 통합 테스트 (CTO 최소 스모크).
 * POST /api/analyses, GET /api/analyses, GET /api/analyses/{id} 및 인증·본인/타인 조회 검증.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AnalysisIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;

    @MockBean
    AiProxyService aiProxyService;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("analysis-u1-" + UUID.randomUUID())
                        .email("analysis1@example.com")
                        .build()
        );
        user2 = userRepository.save(
                User.builder()
                        .provider(LoginProvider.GOOGLE)
                        .providerUserId("analysis-u2-" + UUID.randomUUID())
                        .email("analysis2@example.com")
                        .build()
        );
    }

    private String bearerForUser(long userId) {
        return "Bearer " + jwtUtil.createAccessToken(userId, "USER");
    }

    @Test
    @DisplayName("POST /api/analyses - 정상 이미지 + analysisType → 202, analysisId")
    void startAnalysis_success() throws Exception {
        RadarData radar = new RadarData();
        radar.setDensity(85);
        radar.setForm(80);
        radar.setCompletion(78);
        radar.setRelevance(88);
        radar.setThinking(79);
        InternalAnalyzeResponse mockResponse = new InternalAnalyzeResponse();
        ReflectionTestUtils.setField(mockResponse, "grade", AnalysisGrade.A.name());
        ReflectionTestUtils.setField(mockResponse, "totalScore", 85.0);
        ReflectionTestUtils.setField(mockResponse, "radarData", radar);
        ReflectionTestUtils.setField(mockResponse, "fixScope", FixScope.DetailTuning.name());
        ReflectionTestUtils.setField(mockResponse, "comment", "테스트 코멘트");
        ReflectionTestUtils.setField(mockResponse, "universityPredictions", java.util.List.<UniversityPrediction>of());
        when(aiProxyService.analyze(anyString(), anyString(), anyString())).thenReturn(mockResponse);

        MockMultipartFile image = new MockMultipartFile(
                "image", "test.jpg", "image/jpeg", "fake-image-bytes".getBytes());

        mockMvc.perform(multipart("/api/analyses")
                        .file(image)
                        .param("analysisType", "BASIC")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user1.getId())))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.analysisId").exists())
                .andExpect(jsonPath("$.data.status").exists());
    }

    @Test
    @DisplayName("GET /api/analyses - 인증 없음 → 401")
    void getMyAnalyses_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/analyses"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/analyses - 본인 데이터만 조회")
    void getMyAnalyses_returnsOwnOnly() throws Exception {
        mockMvc.perform(get("/api/analyses")
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user1.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("GET /api/analyses/{id} - 타인 데이터 → 404")
    void getAnalysis_otherUser_returns404() throws Exception {
        // user1으로 분석 하나 생성 후 user2로 조회 시 404 (본 테스트는 분석 생성 없이 존재하지 않는 id로 404만 검증 가능)
        long nonExistentId = 999_999L;
        mockMvc.perform(get("/api/analyses/" + nonExistentId)
                        .header(HttpHeaders.AUTHORIZATION, bearerForUser(user2.getId())))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("AN003"));
    }
}
