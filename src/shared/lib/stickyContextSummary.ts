/**
 * stickyContext.summaryText 생성. 분석 있음/세션 메타만/둘 다 없음에 따라 2~3문장 이내 한국어 요약.
 * LLM이 매 요청마다 "짧은 학생 분석 카드"로 참고할 수 있도록 함.
 */

import type { AnalysisResult } from '../model/types';
import type { ChatSessionDto } from '../api/schemas/chatSession';

function formatScore(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/**
 * 분석이 있을 때: 등급, 점수, 지표, 추천 대학(상위 3개), 코멘트. 없는 필드는 해당 문장 생략.
 * universityPredictions는 스키마 coercion으로 배열 확정 시에만 사용.
 */
function buildSummaryTextFromAnalysis(a: AnalysisResult): string {
  const parts: string[] = [];
  const grade = a.grade != null ? String(a.grade) : null;
  const score = a.totalScore != null ? formatScore(a.totalScore) : null;

  if (grade != null && score != null) {
    parts.push(`학생 분석 요약: 등급=${grade}, 점수=${score}.`);
  } else if (grade != null) {
    parts.push(`학생 분석 요약: 등급=${grade}.`);
  } else if (score != null) {
    parts.push(`학생 분석 요약: 점수=${score}.`);
  }

  if (a.radarData) {
    const { density, form, completion, relevance, thinking } = a.radarData;
    parts.push(
      `주요 지표=density ${density}, form ${form}, completion ${completion}, relevance ${relevance}, thinking ${thinking}.`
    );
  }

  const preds = Array.isArray(a.universityPredictions) ? a.universityPredictions.slice(0, 3) : [];
  if (preds.length > 0) {
    const list = preds
      .map((p) => `${p.name}(${p.type},${Math.round(p.probability * 100)}%)`)
      .join(', ');
    parts.push(`추천 대학군=${list}.`);
  }

  const comment = (a.summaryComment ?? a.comment)?.trim();
  if (comment) {
    parts.push(`분석 코멘트: ${comment}.`);
  }

  if (a.targetMajor?.trim()) parts.push(`목표 전공=${a.targetMajor.trim()}.`);
  if (a.targetUniversity?.trim()) parts.push(`목표 대학=${a.targetUniversity.trim()}.`);

  return parts.length > 0 ? parts.join(' ').replace(/\s+/g, ' ').trim() : '';
}

/**
 * 세션 메타만 있을 때: 등급/점수 있으면 요약 한 문장 + 일반 상담 안내. 없으면 짧은 디폴트만.
 */
function buildSummaryTextFromSession(s: ChatSessionDto): string {
  const grade = s.grade?.trim() || null;
  const score = s.totalScore != null ? formatScore(s.totalScore) : null;
  if (grade != null && score != null) {
    return `학생 분석 요약: 등급=${grade}, 점수=${score}. 분석 결과는 없고, 일반 상담용 채팅 세션입니다.`;
  }
  if (grade != null) {
    return `학생 분석 요약: 등급=${grade}. 분석 결과는 없고, 일반 상담용 채팅 세션입니다.`;
  }
  if (score != null) {
    return `학생 분석 요약: 점수=${score}. 분석 결과는 없고, 일반 상담용 채팅 세션입니다.`;
  }
  return '일반 상담용 채팅 세션입니다.';
}

/**
 * 분석 우선, 없으면 세션 메타로 summaryText 생성. 둘 다 없거나 요약 불가면 undefined.
 */
export function buildSummaryText(
  analysis: AnalysisResult | null,
  sessionMeta: ChatSessionDto | null
): string | undefined {
  if (analysis) {
    const text = buildSummaryTextFromAnalysis(analysis);
    return text || undefined;
  }
  if (sessionMeta) {
    return buildSummaryTextFromSession(sessionMeta);
  }
  return undefined;
}
