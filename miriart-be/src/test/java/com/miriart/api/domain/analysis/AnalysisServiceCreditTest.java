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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * P1 Step 1: 크레딧 한도 — Light(needsProfile=true) 5회 초과 시 CR001, Full(needsProfile=false)는 한도 체크 스킵.
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

    private User lightUser;
    private User fullUser;

    @BeforeEach
    void setUp() {
        lightUser = userRepository.save(
                User.builder()
                        .provider(com.miriart.api.domain.user.entity.LoginProvider.KAKAO)
                        .providerUserId("credit-light-" + java.util.UUID.randomUUID())
                        .email("light@test.com")
                        .build()
        );
        assert lightUser.isNeedsProfile();

        fullUser = userRepository.save(
                User.builder()
                        .provider(com.miriart.api.domain.user.entity.LoginProvider.GOOGLE)
                        .providerUserId("credit-full-" + java.util.UUID.randomUUID())
                        .email("full@test.com")
                        .build()
        );
        fullUser.completeProfile("풀유저", "고3", "기초디자인");
        userRepository.save(fullUser);
    }

    @Test
    @DisplayName("Light 유저 - 사용량 5회 시 6번째 startAnalysis → CR001")
    void lightUser_sixthCall_throwsCR001() {
        // Given: 이번 달 사용 5회 (usage log 5건 생성)
        String yyyyMm = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
        for (int i = 0; i < 5; i++) {
            usageLogRepository.save(
                    AnalysisUsageLog.builder()
                            .user(lightUser)
                            .analysisId(null)
                            .billingYearMonth(yyyyMm)
                            .build()
            );
        }

        MockMultipartFile file = new MockMultipartFile("image", "t.jpg", "image/jpeg", new byte[]{1, 2, 3});

        assertThatThrownBy(() -> analysisService.startAnalysis(lightUser.getId(), file, "basic", null))
                .isInstanceOf(BusinessException.class)
                .satisfies(e -> assertThat(((BusinessException) e).getErrorCode()).isEqualTo(ErrorCode.CREDIT_LIMIT_EXCEEDED));
    }

    @Test
    @DisplayName("Full 유저 - 한도 체크 스킵, usageLogRepository.count 호출 없이 진행 가능")
    void fullUser_limitCheckSkipped() throws Exception {
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
        when(aiProxyService.analyze(anyString(), anyString(), anyString())).thenReturn(mockResp);

        MockMultipartFile file = new MockMultipartFile("image", "t.jpg", "image/jpeg", new byte[]{1, 2, 3});
        analysisService.startAnalysis(fullUser.getId(), file, "basic", null);

        verify(aiProxyService).analyze(anyString(), anyString(), anyString());
    }
}
