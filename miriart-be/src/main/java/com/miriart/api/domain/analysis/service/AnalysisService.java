package com.miriart.api.domain.analysis.service;

import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.analysis.dto.AnalysisDetailResponse;
import com.miriart.api.domain.analysis.dto.AnalysisStartResponse;
import com.miriart.api.domain.analysis.entity.*;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.analysis.repository.AnalysisUsageLogRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.storage.FileCategory;
import com.miriart.api.global.storage.FileStorageService;
import com.miriart.api.global.storage.FileUploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 작품 분석 오케스트레이션 서비스. GCS 업로드 → FastAPI 분석 호출 → DB 저장·크레딧 차감.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link FileStorageService}로 이미지 업로드 후 gcsUri 획득 → {@link AiProxyService#analyze}로 FastAPI /internal/ai/analyze 호출</li>
 *   <li>{@link AnalysisRepository}에 PENDING으로 저장 후 AI 응답으로 complete/fail 업데이트</li>
 *   <li>{@link AnalysisUsageLogRepository}로 월별 사용량 집계, {@link User} 플랜 한도 초과 시 CREDIT_LIMIT_EXCEEDED</li>
 *   <li>{@link AnalysisController}에서 startAnalysis, getAnalysis, getMyAnalyses 호출</li>
 * </ul>
 *
 * <p>AGENT_BE Task 3 기반.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final AnalysisUsageLogRepository usageLogRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final AiProxyService aiProxyService;
    private final ObjectMapper objectMapper;

    /**
     * 작품 업로드 + AI 분석 시작
     * POST /api/analyses
     */
    @Transactional
    public AnalysisStartResponse startAnalysis(Long userId, MultipartFile image,
                                               String analysisType, String problemText) throws IOException {
        User user = userRepository.findByIdOrThrow(userId);

        // 1. 파일 검증
        if (image == null || image.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_EMPTY);
        }

        // 2. 크레딧 한도 체크
        checkCreditLimitIfEligible(user, userId);

        // 3. GCS 업로드 — FileUploadResult로 publicUrl + gcsUri 동시 확보 (Bug #1 Fix)
        FileUploadResult uploadResult = fileStorageService.upload(image, FileCategory.ARTWORK);
        String imageUrl = uploadResult.publicUrl();
        String gcsUrl = uploadResult.gcsUri();

        // 4. analyses INSERT (PENDING)
        Analysis analysis = analysisRepository.save(
                Analysis.builder()
                        .user(user)
                        .gcsUrl(gcsUrl)
                        .imageUrl(imageUrl)
                        .analysisType(analysisType)
                        .problemText(problemText)
                        .build()
        );
        log.debug("분석 생성 - analysisId: {}, userId: {}", analysis.getId(), userId);
        log.info("분석 시작 - analysisId: {}, userId: {}, status: PENDING", analysis.getId(), userId);

        // 5. FastAPI WebClient 호출
        try {
            InternalAnalyzeResponse aiResult = aiProxyService.analyze(gcsUrl, analysisType, problemText);

            // 6. analyses UPDATE (COMPLETED) — DTO 객체를 JSON 문자열로 직렬화하여 저장
            String scoresJson = toJson(aiResult.getRadarData());
            String predictionsJson = toJson(aiResult.getUniversityPredictions() != null ? aiResult.getUniversityPredictions() : java.util.List.of());

            analysis.complete(
                    AnalysisGrade.valueOf(aiResult.getGrade()),
                    aiResult.getTotalScore(),
                    scoresJson,
                    aiResult.getFixScope() != null ? FixScope.valueOf(aiResult.getFixScope()) : null,
                    aiResult.getComment(),
                    predictionsJson
            );
            analysisRepository.save(analysis);
        } catch (BusinessException e) {
            analysis.fail();
            analysisRepository.save(analysis);
            log.info("분석 실패 - analysisId: {}, userId: {}, status: FAILED", analysis.getId(), userId);
            throw e;
        }

        // 7. usage_logs INSERT
        usageLogRepository.save(AnalysisUsageLog.create(user, analysis.getId()));
        log.info("분석 완료 - analysisId: {}, userId: {}, status: COMPLETED", analysis.getId(), userId);

        return AnalysisStartResponse.from(analysis);
    }

    /**
     * 분석 결과 단건 조회 (본인 것만)
     * GET /api/analyses/{id}
     */
    @Transactional(readOnly = true)
    public AnalysisDetailResponse getAnalysis(Long userId, Long analysisId) {
        Analysis analysis = analysisRepository.findByIdAndUserId(analysisId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANALYSIS_NOT_FOUND));
        return AnalysisDetailResponse.from(analysis, objectMapper);
    }

    /**
     * 내 분석 목록 조회
     * GET /api/analyses
     */
    @Transactional(readOnly = true)
    public Page<AnalysisDetailResponse> getMyAnalyses(Long userId, Pageable pageable) {
        return analysisRepository.findByUserId(userId, pageable)
                .map(a -> AnalysisDetailResponse.from(a, objectMapper));
    }

    /**
     * 현재 월 청구 기간 문자열 (YYYY-MM)
     */
    public long getUsedThisMonth(Long userId) {
        return usageLogRepository.countByUserIdAndBillingYearMonth(userId, currentBillingMonth());
    }

    /**
     * 온보딩 완료 유저는 플랜에 따른 월 한도 제한을 적용한다.
     * needsProfile=true(온보딩 전)는 P1에서는 체험용으로 한도 미적용.
     */
    private void checkCreditLimitIfEligible(User user, Long userId) {
        if (!user.isNeedsProfile()) {
            String billingYearMonth = currentBillingMonth();
            long usedThisMonth = usageLogRepository.countByUserIdAndBillingYearMonth(userId, billingYearMonth);
            int monthlyLimit = user.getPlanType().getMonthlyLimit();
            if (usedThisMonth >= monthlyLimit) {
                log.warn("분석 크레딧 한도 초과 - userId: {}, usedThisMonth: {}, limit: {}", userId, usedThisMonth, monthlyLimit);
                throw new BusinessException(ErrorCode.CREDIT_LIMIT_EXCEEDED);
            }
        }
    }

    private String currentBillingMonth() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }

    private String toJson(Object value) {
        if (value == null) return null;
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.warn("JSON 직렬화 실패, null 반환: {}", e.getMessage());
            return null;
        }
    }
}
