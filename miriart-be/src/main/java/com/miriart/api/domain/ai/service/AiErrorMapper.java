package com.miriart.api.domain.ai.service;

import com.miriart.api.global.exception.ErrorCode;
import org.springframework.http.HttpStatusCode;

/**
 * AI 서비스 HTTP 응답(status + body code)을 BE ErrorCode로 매핑.
 *
 * <p>SSOT: 429+LLM_RATE_LIMITED→AN004/AI004, 504+LLM_TIMEOUT→AN002/AI002, 502+GCS_ERROR→F005, 502+LLM_*→AN001/AI001, 400+VALIDATION_ERROR→C001.</p>
 *
 * @author MiriArt Team
 */
public final class AiErrorMapper {

    public static final String AI_CODE_LLM_TIMEOUT = "LLM_TIMEOUT";
    public static final String AI_CODE_GCS_ERROR = "GCS_ERROR";
    public static final String AI_CODE_LLM_SERVICE_ERROR = "LLM_SERVICE_ERROR";
    public static final String AI_CODE_LLM_PARSING_ERROR = "LLM_PARSING_ERROR";
    public static final String AI_CODE_VALIDATION_ERROR = "VALIDATION_ERROR";
    // FastAPI SSOT: 429 + LLM_RATE_LIMITED — LLM 공급자 rate limit / DSQ 초과
    public static final String AI_CODE_LLM_RATE_LIMITED = "LLM_RATE_LIMITED";

    private AiErrorMapper() {}

    /**
     * AI HTTP 상태 + body code → BE ErrorCode.
     *
     * @param statusCode AI 응답 HTTP status
     * @param aiCode     AI 응답 body의 code (null 가능)
     * @param forAnalyze true면 analyze 경로(AN001/AN002), false면 chat 경로(AI001/AI002)
     * @return BE ErrorCode
     */
    public static ErrorCode toErrorCode(HttpStatusCode statusCode, String aiCode, boolean forAnalyze) {
        int status = statusCode.value();

        // 401/403: Cloud Run IAM 인증 실패 (OIDC 토큰 만료·누락·권한 부족)
        if (status == 401 || status == 403) {
            return ErrorCode.AI_SERVICE_AUTH_FAILED;
        }

        // 429: LLM 공급자 rate limit / DSQ 초과 (FastAPI SSOT: LLM_RATE_LIMITED)
        if (status == 429) {
            return forAnalyze ? ErrorCode.AI_ANALYSIS_RATE_LIMITED : ErrorCode.AI_CHAT_RATE_LIMITED;
        }

        if (status == 504) {
            if (AI_CODE_LLM_TIMEOUT.equals(aiCode)) {
                return forAnalyze ? ErrorCode.AI_ANALYSIS_TIMEOUT : ErrorCode.AI_CHAT_TIMEOUT;
            }
            return forAnalyze ? ErrorCode.AI_ANALYSIS_TIMEOUT : ErrorCode.AI_CHAT_TIMEOUT;
        }

        if (status == 502) {
            if (AI_CODE_GCS_ERROR.equals(aiCode)) {
                return ErrorCode.IMAGE_URL_GENERATION_FAILED; // F005
            }
            if (AI_CODE_LLM_SERVICE_ERROR.equals(aiCode) || AI_CODE_LLM_PARSING_ERROR.equals(aiCode)) {
                return forAnalyze ? ErrorCode.AI_ANALYSIS_FAILED : ErrorCode.AI_CHAT_FAILED;
            }
            return forAnalyze ? ErrorCode.AI_ANALYSIS_FAILED : ErrorCode.AI_CHAT_FAILED;
        }

        if (status == 400) {
            if (AI_CODE_VALIDATION_ERROR.equals(aiCode)) {
                return ErrorCode.INVALID_INPUT_VALUE; // C001
            }
            return ErrorCode.INVALID_INPUT_VALUE;
        }

        return forAnalyze ? ErrorCode.AI_ANALYSIS_FAILED : ErrorCode.AI_CHAT_FAILED;
    }
}
