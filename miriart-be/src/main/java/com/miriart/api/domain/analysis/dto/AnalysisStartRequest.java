package com.miriart.api.domain.analysis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * POST /api/analyses 요청 DTO. multipart/form-data의 analysisType·problemText (선택) 필드.
 *
 * <p>연계: FE에서 이미지+이 필드 전송 → {@link AnalysisController}가 {@link AnalysisService#startAnalysis}에 전달.</p>
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
public class AnalysisStartRequest {

    @NotBlank(message = "분석 유형은 필수입니다")
    @Pattern(regexp = "^(basic|major)$", message = "analysisType은 basic 또는 major여야 합니다")
    private String analysisType;

    private String problemText;
}
