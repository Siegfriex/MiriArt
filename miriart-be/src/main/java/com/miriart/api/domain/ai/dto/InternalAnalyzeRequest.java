package com.miriart.api.domain.ai.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * FastAPI POST /internal/ai/analyze 요청 DTO (BE → FastAPI). Python InternalAnalyzeRequest와 필드 대응.
 *
 * <p>연계: {@link com.miriart.api.domain.analysis.service.AnalysisService}에서 GCS 업로드 후 gcsUri·analysisType·problemText를 담아
 * {@link AiProxyService#analyze} → WebClient로 전송.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class InternalAnalyzeRequest {

    private String gcsUri;
    private String analysisType;
    private String problemText;
}
