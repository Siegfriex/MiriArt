package com.miriart.api.domain.ai;

import com.miriart.api.domain.ai.service.AiErrorMapper;
import com.miriart.api.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpStatusCode;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * AiErrorMapper 단위 테스트.
 * FastAPI SSOT 에러 코드 → BE ErrorCode 매핑 검증.
 */
class AiErrorMapperTest {

    // ── 429 LLM_RATE_LIMITED ─────────────────────────────────────────────────

    @Test
    @DisplayName("429 + LLM_RATE_LIMITED → AN004 (analyze)")
    void status429_analyze_mapsToAN004() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(429), "LLM_RATE_LIMITED", true);
        assertThat(result).isEqualTo(ErrorCode.AI_ANALYSIS_RATE_LIMITED);
    }

    @Test
    @DisplayName("429 + LLM_RATE_LIMITED → AI004 (chat)")
    void status429_chat_mapsToAI004() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(429), "LLM_RATE_LIMITED", false);
        assertThat(result).isEqualTo(ErrorCode.AI_CHAT_RATE_LIMITED);
    }

    @Test
    @DisplayName("429 + null aiCode → AN004 (status-only 매핑)")
    void status429_nullAiCode_mapsToAN004() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(429), null, true);
        assertThat(result).isEqualTo(ErrorCode.AI_ANALYSIS_RATE_LIMITED);
    }

    @Test
    @DisplayName("429 + 빈 aiCode → AI004 (status-only 매핑)")
    void status429_emptyAiCode_mapsToAI004() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(429), "", false);
        assertThat(result).isEqualTo(ErrorCode.AI_CHAT_RATE_LIMITED);
    }

    // ── 504 LLM_TIMEOUT ─────────────────────────────────────────────────────

    @Test
    @DisplayName("504 + LLM_TIMEOUT → AN002 (analyze)")
    void status504_analyze_mapsToAN002() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(504), "LLM_TIMEOUT", true);
        assertThat(result).isEqualTo(ErrorCode.AI_ANALYSIS_TIMEOUT);
    }

    @Test
    @DisplayName("504 + LLM_TIMEOUT → AI002 (chat)")
    void status504_chat_mapsToAI002() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(504), "LLM_TIMEOUT", false);
        assertThat(result).isEqualTo(ErrorCode.AI_CHAT_TIMEOUT);
    }

    // ── 502 LLM_SERVICE_ERROR / GCS_ERROR / LLM_PARSING_ERROR ───────────────

    @Test
    @DisplayName("502 + GCS_ERROR → F005")
    void status502_gcsError_mapsToF005() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(502), "GCS_ERROR", true);
        assertThat(result).isEqualTo(ErrorCode.IMAGE_URL_GENERATION_FAILED);
    }

    @ParameterizedTest
    @CsvSource({"LLM_SERVICE_ERROR", "LLM_PARSING_ERROR"})
    @DisplayName("502 + LLM_SERVICE_ERROR/LLM_PARSING_ERROR → AN001 (analyze)")
    void status502_llmErrors_analyze_mapsToAN001(String aiCode) {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(502), aiCode, true);
        assertThat(result).isEqualTo(ErrorCode.AI_ANALYSIS_FAILED);
    }

    @ParameterizedTest
    @CsvSource({"LLM_SERVICE_ERROR", "LLM_PARSING_ERROR"})
    @DisplayName("502 + LLM_SERVICE_ERROR/LLM_PARSING_ERROR → AI001 (chat)")
    void status502_llmErrors_chat_mapsToAI001(String aiCode) {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(502), aiCode, false);
        assertThat(result).isEqualTo(ErrorCode.AI_CHAT_FAILED);
    }

    // ── 400 VALIDATION_ERROR ────────────────────────────────────────────────

    @Test
    @DisplayName("400 + VALIDATION_ERROR → C001")
    void status400_validationError_mapsToC001() {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(400), "VALIDATION_ERROR", true);
        assertThat(result).isEqualTo(ErrorCode.INVALID_INPUT_VALUE);
    }

    // ── 401/403 Cloud Run IAM ───────────────────────────────────────────────

    @ParameterizedTest
    @CsvSource({"401", "403"})
    @DisplayName("401/403 → AI003 (AI_SERVICE_AUTH_FAILED)")
    void status401or403_mapsToAI003(int status) {
        ErrorCode result = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(status), null, true);
        assertThat(result).isEqualTo(ErrorCode.AI_SERVICE_AUTH_FAILED);
    }

    // ── fallback ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("알 수 없는 상태 코드 → AN001/AI001 fallback")
    void unknownStatus_fallback() {
        ErrorCode analyze = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(418), null, true);
        ErrorCode chat = AiErrorMapper.toErrorCode(HttpStatusCode.valueOf(418), null, false);
        assertThat(analyze).isEqualTo(ErrorCode.AI_ANALYSIS_FAILED);
        assertThat(chat).isEqualTo(ErrorCode.AI_CHAT_FAILED);
    }
}
