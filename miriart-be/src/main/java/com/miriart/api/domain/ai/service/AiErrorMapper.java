package com.miriart.api.domain.ai.service;

import com.miriart.api.global.exception.ErrorCode;
import org.springframework.http.HttpStatusCode;

/**
 * AI 서비스 HTTP 응답(status + body code)을 BE ErrorCode로 매핑.
 *
 * <p>SSOT: 504+LLM_TIMEOUT→AN002/AI002, 502+GCS_ERROR→F005, 502+LLM_*→AN001/AI001, 400+VALIDATION_ERROR→C001.</p>
 *
 * @author MiriArt Team
 */
public final class AiErrorMapper {

    public static final String AI_CODE_LLM_TIMEOUT = "LLM_TIMEOUT";
    public static final String AI_CODE_GCS_ERROR = "GCS_ERROR";
    public static final String AI_CODE_LLM_SERVICE_ERROR = "LLM_SERVICE_ERROR";
    public static final String AI_CODE_LLM_PARSING_ERROR = "LLM_PARSING_ERROR";
    public static final String AI_CODE_VALIDATION_ERROR = "VALIDATION_ERROR";

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
