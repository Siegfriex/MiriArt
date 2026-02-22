package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * FastAPI POST /internal/ai/analyze 요청 DTO
 */
@Getter
@Builder
public class InternalAnalyzeRequest {

    private String gcsUri;
    private String analysisType;
    private String problemText;
}
