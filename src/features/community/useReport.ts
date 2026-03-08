/**
 * @fileoverview 신고 훅. useMutation + communityApi.report. 실패 시 handleApiError로 메시지 추출 후 토스트.
 */

import { useMutation } from '@tanstack/react-query';
import { communityApi } from '@/entities/community/api/communityApi';
import { handleApiError } from '@/shared/api/miriartApi';
import { useToastStore } from '@/shared/model/toastStore';

export interface ReportParams {
  type: string;
  id: string;
  reason: string;
}

export function useReport() {
  return useMutation({
    mutationFn: ({ type, id, reason }: ReportParams) => communityApi.report(type, id, reason),
    onError: (err) => {
      useToastStore.getState().show(handleApiError(err), 'error');
    },
  });
}
