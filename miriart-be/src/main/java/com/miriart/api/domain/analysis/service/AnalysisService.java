package com.miriart.api.domain.analysis.service;

import com.miriart.api.domain.ai.dto.InternalAnalyzeResponse;
import com.miriart.api.domain.ai.service.AiProxyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.analysis.dto.AnalysisDetailResponse;
import com.miriart.api.domain.analysis.dto.AnalysisStartResponse;
import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.analysis.repository.AnalysisUsageLogRepository;
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
import java.util.Set;

/**
 * 작품 분석 오케스트레이션 서비스.
 *
 * <p>트랜잭션 전략 (3단계 분리):</p>
 * <ol>
 *   <li>파일 검증 + GCS 업로드 (트랜잭션 외부 — I/O)</li>
 *   <li>크레딧 체크 + PENDING INSERT ({@link AnalysisFailHandler#savePending} — 트랜잭션 1)</li>
 *   <li>FastAPI AI 호출 (트랜잭션 외부 — 네트워크 I/O)</li>
 *   <li>성공 → COMPLETED UPDATE + usage log ({@link AnalysisFailHandler#complete} — 트랜잭션 2)</li>
 *   <li>실패 → FAILED UPDATE ({@link AnalysisFailHandler#markFailed} — 독립 트랜잭션)</li>
 * </ol>
 *
 * <p>AI 호출 실패 시에도 FAILED 레코드가 DB에 남아 운영 모니터링이 가능하다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final AnalysisUsageLogRepository usageLogRepository;
    private final FileStorageService fileStorageService;
    private final AiProxyService aiProxyService;
    private final AnalysisFailHandler analysisFailHandler;
    private final ObjectMapper objectMapper;

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/gif"
    );

    /**
     * 작품 업로드 + AI 분석 시작 (3단계 트랜잭션)
     * POST /api/analyses
     */
    public AnalysisStartResponse startAnalysis(Long userId, MultipartFile image,
                                               String analysisType, String problemText) throws IOException {
        // 1. 파일 검증 (트랜잭션 불필요)
        if (image == null || image.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_EMPTY);
        }
        String contentType = image.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
        }

        // 2. GCS 업로드 (트랜잭션 불필요 — 파일 I/O)
        FileUploadResult uploadResult = fileStorageService.upload(image, FileCategory.ARTWORK);

        // 3. 크레딧 체크 + PENDING INSERT (트랜잭션 1)
        Analysis analysis = analysisFailHandler.savePending(userId, uploadResult, analysisType, problemText);
        log.info("분석 시작 - analysisId: {}, userId: {}, status: PENDING", analysis.getId(), userId);

        // 4. FastAPI AI 호출 (트랜잭션 외부)
        try {
            InternalAnalyzeResponse aiResult = aiProxyService.analyze(
                    analysis.getGcsUrl(), analysisType, problemText);

            // 5. COMPLETED UPDATE + usage log (트랜잭션 2)
            analysisFailHandler.complete(analysis.getId(), userId, aiResult);
            log.info("분석 완료 - analysisId: {}, userId: {}, status: COMPLETED", analysis.getId(), userId);

        } catch (Exception e) {
            // 6. FAILED UPDATE (PENDING이 이미 커밋되어 있으므로 조회·업데이트 가능)
            try {
                analysisFailHandler.markFailed(analysis.getId());
            } catch (Exception failEx) {
                log.error("markFailed 자체 실패 - analysisId: {}", analysis.getId(), failEx);
            }
            log.info("분석 실패 - analysisId: {}, userId: {}, cause: {}", analysis.getId(), userId, e.getMessage());

            if (e instanceof BusinessException) {
                throw e;
            }
            throw new BusinessException(ErrorCode.AI_ANALYSIS_FAILED);
        }

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
     * 현재 월 사용량 조회
     */
    public long getUsedThisMonth(Long userId) {
        return usageLogRepository.countByUserIdAndBillingYearMonth(userId, currentBillingMonth());
    }

    private String currentBillingMonth() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }
}
