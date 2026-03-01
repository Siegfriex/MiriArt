/**
 * POST /api/chat React Query mutation 훅 스켈레톤.
 * TODO: React Query 도입 시 실제로 사용하도록 페이지/훅을 교체 (예: chat-room에서 ChatApi.sendMessage 대신 useChatMutation 사용).
 */

import { useMutation } from '@tanstack/react-query';
import { apiFetch, getAuthHeaders, ApiError } from '../../shared/api/miriartApi';
import { chatResponseSchema, type ChatResponse } from '../../shared/api/schemas/chat';
import type { ChatRequest } from '../../shared/api/miriartApi';

export function useChatMutation() {
  return useMutation({
    mutationFn: async (params: ChatRequest): Promise<ChatResponse> => {
      const raw = await apiFetch<unknown>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(params),
      });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = chatResponseSchema.safeParse(payload);
      if (!parsed.success) throw new ApiError(500, 'Invalid chat response');
      return parsed.data;
    },
  });
}
