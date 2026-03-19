package com.miriart.api.domain.analysis.service;

import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.analysis.entity.*;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.analysis.repository.AnalysisUsageLogRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import com.miriart.api.global.storage.FileUploadResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * AnalysisService의 트랜잭션 경계를 담당하는 헬퍼.
 *
 * <p>Spring 프록시 기반 @Transactional은 self-invocation에 적용되지 않으므로,
 * 트랜잭션이 필요한 DB 작업을 별도 빈으로 분리한다.</p>
 *
 * <p>트랜잭션 구조:</p>
 * <ul>
 *   <li>{@link #savePending} — 크레딧 체크 + PENDING INSERT (트랜잭션 1)</li>
 *   <li>{@link #complete} — COMPLETED UPDATE + usage log INSERT (트랜잭션 2)</li>
 *   <li>{@link #markFailed} — FAILED UPDATE (독립 트랜잭션)</li>
 * </ul>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AnalysisFailHandler {

    private final AnalysisRepository analysisRepository;
    private final AnalysisUsageLogRepository usageLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /** 크레딧 한도 미적용 이메일(쉼표 구분). 해당 구글 계정은 버짓 해제. */
    @Value("${miriart.auth.budget-exempt-emails:}")
    private String budgetExemptEmailsConfig;

    private Set<String> getBudgetExemptEmails() {
        if (budgetExemptEmailsConfig == null || budgetExemptEmailsConfig.isBlank()) {
            return Set.of();
        }
        return Stream.of(budgetExemptEmailsConfig.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    @Transactional
    public Analysis savePending(Long userId, FileUploadResult uploadResult,
                                String analysisType, String problemText) {
        User user = userRepository.findByIdOrThrow(userId);
        checkCreditLimit(user, userId);

        return analysisRepository.save(
                Analysis.builder()
                        .user(user)
                        .gcsUrl(uploadResult.gcsUri())
                        .imageUrl(uploadResult.publicUrl())
                        .analysisType(analysisType)
                        .problemText(problemText)
                        .build()
        );
    }

    @Transactional
    public void complete(Long analysisId, Long userId, InternalAnalyzeResponse aiResult) {
        Analysis analysis = analysisRepository.findById(analysisId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ANALYSIS_NOT_FOUND));

        String scoresJson = toJson(aiResult.getRadarData());
        String predictionsJson = toJson(
                aiResult.getUniversityPredictions() != null ? aiResult.getUniversityPredictions() : List.of());

        analysis.complete(
                parseGrade(aiResult.getGrade()),
                aiResult.getTotalScore(),
                scoresJson,
                parseFixScope(aiResult.getFixScope()),
                aiResult.getComment(),
                predictionsJson
        );
        analysisRepository.save(analysis);

        User user = userRepository.findByIdOrThrow(userId);
        usageLogRepository.save(AnalysisUsageLog.create(user, analysisId));
    }

    @Transactional
    public void markFailed(Long analysisId) {
        analysisRepository.findById(analysisId).ifPresent(analysis -> {
            analysis.fail();
            analysisRepository.save(analysis);
            log.debug("분석 FAILED 상태 저장 완료 - analysisId: {}", analysisId);
        });
    }

    private void checkCreditLimit(User user, Long userId) {
        if (!user.isNeedsProfile()) {
            String email = user.getEmail();
            if (email != null && !email.isBlank() && getBudgetExemptEmails().contains(email.trim().toLowerCase())) {
                log.debug("크레딧 한도 미적용(버짓 해제) - userId: {}, email: {}", userId, email);
                return;
            }
            String billingYearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            long usedThisMonth = usageLogRepository.countByUserIdAndBillingYearMonth(userId, billingYearMonth);
            int monthlyLimit = user.getPlanType().getMonthlyLimit();
            if (usedThisMonth >= monthlyLimit) {
                log.warn("분석 크레딧 한도 초과 - userId: {}, used: {}, limit: {}", userId, usedThisMonth, monthlyLimit);
                throw new BusinessException(ErrorCode.CREDIT_LIMIT_EXCEEDED);
            }
        }
    }

    private AnalysisGrade parseGrade(String grade) {
        if (grade == null) return null;
        return Arrays.stream(AnalysisGrade.values())
                .filter(g -> g.name().equals(grade))
                .findFirst()
                .orElseGet(() -> {
                    log.warn("알 수 없는 분석 등급 '{}', 기본값 F 적용", grade);
                    return AnalysisGrade.F;
                });
    }

    private FixScope parseFixScope(String fixScope) {
        if (fixScope == null) return null;
        return Arrays.stream(FixScope.values())
                .filter(f -> f.name().equals(fixScope))
                .findFirst()
                .orElseGet(() -> {
                    log.warn("알 수 없는 FixScope '{}', 기본값 DetailTuning 적용", fixScope);
                    return FixScope.DetailTuning;
                });
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
