package com.miriart.api.domain.analysis.entity;

/**
 * 수정 범위 제안. StructureRebuild(구조 재설계) / DetailTuning(디테일 조정). FastAPI 분석 결과와 동일.
 *
 * <p>연계: FastAPI InternalAnalyzeResponse.fixScope 문자열을 {@link Analysis#complete}에서 valueOf하여 저장.</p>
 *
 * @author MiriArt Team
 */
public enum FixScope {
    StructureRebuild,
    DetailTuning
}
