package com.miriart.api.domain.analysis.entity;

/**
 * 작품 분석 등급 (A/B/C/D/F). FastAPI 5축 총점 기반 산출과 동일.
 *
 * <p>연계: FastAPI InternalAnalyzeResponse.grade 문자열을 {@link Analysis#complete}에서 valueOf하여 저장.</p>
 *
 * @author MiriArt Team
 */
public enum AnalysisGrade {
    A, B, C, D, F
}
