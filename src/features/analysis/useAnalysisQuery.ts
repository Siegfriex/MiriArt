/**
 * GET /api/analyses/{id} React Query 훅 스켈레톤.
 * TODO: React Query 도입 시 실제로 사용하도록 페이지/훅을 교체 (예: result-detail, 분석 완료 후 상세 조회).
 */

import { useQuery } from '@tanstack/react-query';
import { apiFetch, getAuthHeaders, ApiError } from '../../shared/api/miriartApi';
import { analysisResponseSchema } from '../../shared/api/schemas/analysis';
import { normalizeAnalysisResult } from '../../entities/analysis/schema';
import type { AnalysisResult } from '../../shared/model/types';

export function useAnalysisQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['analyses', id],
    queryFn: async (): Promise<AnalysisResult> => {
      const raw = await apiFetch<unknown>(`/api/analyses/${id}`, { headers: getAuthHeaders() });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = analysisResponseSchema.safeParse(payload);
      if (!parsed.success) throw new ApiError(500, 'Invalid analysis response');
      return normalizeAnalysisResult(parsed.data);
    },
    enabled: !!id,
  });
}
