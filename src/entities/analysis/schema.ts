/**
 * @fileoverview Analysis API 응답 → 도메인 모델 정규화. API 계약 변경 시 이 레이어만 수정.
 * @참조 miriartApi AnalysisApi, result-detail Page, UploadFlow
 */

import type { AnalysisResponseApi } from '../../shared/api/schemas/analysis';
import type { AnalysisResult, RadarData, FixScope } from '../../shared/model/types';
import { Grade } from '../../shared/model/types';

/** API grade 문자열 → Grade enum. BE가 A~F 외 값을 주면 A로 폴백 */
function parseGrade(value: string): Grade {
  const map: Record<string, Grade> = {
    A: Grade.A,
    B: Grade.B,
    C: Grade.C,
    D: Grade.D,
    F: Grade.F,
  };
  return map[value] ?? Grade.A;
}

/** API 응답을 도메인 AnalysisResult로 변환. imageUrl/university/major 등은 overrides 또는 기본값 사용 */
export function normalizeAnalysisResult(
  api: AnalysisResponseApi,
  overrides?: {
    imageUrl?: string;
    university?: string;
    major?: string;
    comparisonTiers?: AnalysisResult['comparisonTiers'];
    hasAcceptedArtwork?: boolean;
  }
): AnalysisResult {
  const radarData: RadarData = {
    density: api.radarData.density,
    form: api.radarData.form,
    completion: api.radarData.completion,
    relevance: api.radarData.relevance,
    thinking: api.radarData.thinking,
  };
  return {
    id: api.id,
    imageUrl: overrides?.imageUrl ?? api.imageUrl ?? '',
    grade: parseGrade(api.grade),
    totalScore: api.totalScore,
    university: overrides?.university ?? api.university ?? '—',
    major: overrides?.major ?? api.major ?? '—',
    timestamp: Date.now(),
    radarData,
    fixScope: api.fixScope as FixScope,
    comment: api.comment,
    comparisonTiers: overrides?.comparisonTiers,
    hasAcceptedArtwork: overrides?.hasAcceptedArtwork ?? false,
  };
}

// TODO: imageUrl, comparisonTiers, hasAcceptedArtwork는 추후 별도 API 또는 응답 확장으로 채울 수 있음
