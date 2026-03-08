/**
 * @fileoverview 신고 훅. useMutation + communityApi.report.
 */

import { useMutation } from '@tanstack/react-query';
import { communityApi } from '@/entities/community/api/communityApi';

export interface ReportParams {
  type: string;
  id: string;
  reason: string;
}

export function useReport() {
  return useMutation({
    mutationFn: ({ type, id, reason }: ReportParams) => communityApi.report(type, id, reason),
  });
}
