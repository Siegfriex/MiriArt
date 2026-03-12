/**
 * stickyContext / summaryText 디버깅용. DEV에서만 동작하며, VITE_DEBUG_STICKY=true 시에만 로그 출력.
 * .env.local에 VITE_DEBUG_STICKY=true 추가 후 재시작하면 활성화.
 */
const DEBUG_STICKY =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.DEV === true &&
  import.meta.env?.VITE_DEBUG_STICKY === 'true';

export function debugStickyContext(label: string, payload: unknown): void {
  if (!DEBUG_STICKY) return;
  const summary =
    payload != null && typeof payload === 'object' && 'grade' in payload
      ? {
          grade: (payload as { grade?: unknown }).grade,
          score: (payload as { score?: unknown }).score,
          fixScope: (payload as { fixScope?: unknown }).fixScope,
          hasSummaryText: 'summaryText' in payload && (payload as { summaryText?: unknown }).summaryText != null,
          summaryTextLength: typeof (payload as { summaryText?: string }).summaryText === 'string'
            ? (payload as { summaryText: string }).summaryText.length
            : 0,
        }
      : payload;
  console.log(`[stickyContext] ${label}`, summary);
}

/** buildSummaryText 입력·결과 로그 (분석 연동 / 일반 세션). */
export function debugSummaryText(
  kind: 'analysis' | 'session',
  inputs: { grade?: unknown; totalScore?: unknown; hasRadarData?: boolean; universityPredictionsLength?: number },
  result: string | undefined
): void {
  if (!DEBUG_STICKY) return;
  console.log(`[buildSummaryText] ${kind}`, inputs, '->', result ?? '(empty)');
}
