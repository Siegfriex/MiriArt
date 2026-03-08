package com.miriart.api.domain.analysis;

import com.miriart.api.domain.analysis.entity.AnalysisUsageLog;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.analysis.repository.AnalysisUsageLogRepository;
import com.miriart.api.domain.analysis.service.AnalysisService;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.storage.FileStorageService;
import com.miriart.api.domain.ai.service.AiProxyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * P1 크레딧 한도 테스트 — 온보딩 완료(needsProfile=false) 유저에게 플랜별 월 한도 적용,
 * 온보딩 전(needsProfile=true)은 체험용으로 한도 미적용.
 */
@SpringBootTest
class AnalysisServiceCreditTest {

    @Autowired
    AnalysisService analysisService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AnalysisUsageLogRepository usageLogRepository;
    @Autowired
    AnalysisRepository analysisRepository;

    @MockBean
    FileStorageService fileStorageService;
    @MockBean
    AiProxyService aiProxyService;

    private User onboardedUser;
    private User needsProfileUser;

    @BeforeEach
    void setUp() {
        // 온보딩 완료 유저 (needsProfile=false, PlanType.FREE)
        onboardedUser = userRepository.save(
                User.builder()
                        .provider(com.miriart.api.domain.user.entity.LoginProvider.KAKAO)
                        .providerUserId("credit-onboarded-" + java.util.UUID.randomUUID())
                        .email("onboarded@test.com")
                        .build()
        );
        onboardedUser.completeProfile("온보딩유저-" + java.util.UUID.randomUUID().toString().substring(0, 8), "고3", "기초디자인");
        userRepository.save(onboardedUser);
        assert !onboardedUser.isNeedsProfile();

        // 온보딩 전 유저 (needsProfile=true, PlanType.FREE)
        needsProfileUser = userRepository.save(
                User.builder()
                        .provider(com.miriart.api.domain.user.entity.LoginProvider.GOOGLE)
                        .providerUserId("credit-needs-" + java.util.UUID.randomUUID())
                        .email("needs@test.com")
                        .build()
        );
        assert needsProfileUser.isNeedsProfile();
    }

    @Test
    @DisplayName("온보딩 완료 유저 - 사용량 5회(FREE 한도) 시 6번째 startAnalysis → CREDIT_LIMIT_EXCEEDED")
    void onboardedUser_limitReached_throwsCreditLimitExceeded() {
        // Given: 이번 달 사용 5회 (FREE 한도 = 5)
        String yyyyMm = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
        for (int i = 0; i < 5; i++) {
            usageLogRepository.save(
                    AnalysisUsageLog.builder()
                            .user(onboardedUser)
                            .analysisId(null)
                            .billingYearMonth(yyyyMm)
                            .build()
            );
        }

        MockMultipartFile file = new MockMultipartFile("image", "t.jpg", "image/jpeg", new byte[]{1, 2, 3});

        // When & Then
        assertThatThrownBy(() -> analysisService.startAnalysis(onboardedUser.getId(), file, "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.CREDIT_LIMIT_EXCEEDED));
    }

    @Test
    @DisplayName("온보딩 완료 유저 - 사용량 한도 미만이면 크레딧 관련 예외 없이 정상 진행")
    void onboardedUser_underLimit_proceedsNormally() throws Exception {
        // Given: 이번 달 사용 3회 (FREE 한도 5 미만)
        String yyyyMm = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
        for (int i = 0; i < 3; i++) {
            usageLogRepository.save(
                    AnalysisUsageLog.builder()
                            .user(onboardedUser)
                            .analysisId(null)
                            .billingYearMonth(yyyyMm)
                            .build()
            );
        }

        // Mock 설정
        com.miriart.api.domain.ai.dto.RadarData radar = new com.miriart.api.domain.ai.dto.RadarData();
        radar.setDensity(80);
        radar.setForm(75);
        radar.setCompletion(70);
        radar.setRelevance(85);
        radar.setThinking(72);
        com.miriart.api.domain.ai.dto.InternalAnalyzeResponse mockResp = new com.miriart.api.domain.ai.dto.InternalAnalyzeResponse();
        mockResp.setGrade("B");
        mockResp.setTotalScore(76.0);
        mockResp.setRadarData(radar);
        mockResp.setFixScope("DetailTuning");
        mockResp.setComment("ok");
        mockResp.setUniversityPredictions(List.of());

        when(fileStorageService.upload(any(), any())).thenReturn(
                new com.miriart.api.global.storage.FileUploadResult("https://example.com/x", "gs://b/x"));
        when(aiProxyService.analyze(anyString(), anyString(), any())).thenReturn(mockResp);

        MockMultipartFile file = new MockMultipartFile("image", "t.jpg", "image/jpeg", new byte[]{1, 2, 3});

        // When & Then: CREDIT_LIMIT_EXCEEDED 예외가 발생하지 않아야 한다
        assertDoesNotThrow(() -> analysisService.startAnalysis(onboardedUser.getId(), file, "basic", null));
    }

    @Test
    @DisplayName("온보딩 전 유저 - P1 정책상 크레딧 한도 미적용, 사용량 초과해도 크레딧 예외 없음")
    void needsProfileUser_noLimitEnforced() throws Exception {
        // Given: 이번 달 사용 10회 (FREE 한도 5를 초과하지만 온보딩 전이라 미적용)
        String yyyyMm = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
        for (int i = 0; i < 10; i++) {
            usageLogRepository.save(
                    AnalysisUsageLog.builder()
                            .user(needsProfileUser)
                            .analysisId(null)
                            .billingYearMonth(yyyyMm)
                            .build()
            );
        }

        // Mock 설정
        com.miriart.api.domain.ai.dto.RadarData radar = new com.miriart.api.domain.ai.dto.RadarData();
        radar.setDensity(80);
        radar.setForm(75);
        radar.setCompletion(70);
        radar.setRelevance(85);
        radar.setThinking(72);
        com.miriart.api.domain.ai.dto.InternalAnalyzeResponse mockResp = new com.miriart.api.domain.ai.dto.InternalAnalyzeResponse();
        mockResp.setGrade("B");
        mockResp.setTotalScore(76.0);
        mockResp.setRadarData(radar);
        mockResp.setFixScope("DetailTuning");
        mockResp.setComment("ok");
        mockResp.setUniversityPredictions(List.of());

        when(fileStorageService.upload(any(), any())).thenReturn(
                new com.miriart.api.global.storage.FileUploadResult("https://example.com/x", "gs://b/x"));
        when(aiProxyService.analyze(anyString(), anyString(), any())).thenReturn(mockResp);

        MockMultipartFile file = new MockMultipartFile("image", "t.jpg", "image/jpeg", new byte[]{1, 2, 3});

        // When & Then: 온보딩 전이므로 CREDIT_LIMIT_EXCEEDED가 발생하지 않아야 한다
        assertDoesNotThrow(() -> analysisService.startAnalysis(needsProfileUser.getId(), file, "basic", null));
    }
}
