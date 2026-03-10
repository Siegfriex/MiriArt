/**
 * @fileoverview POST /api/chat React Query mutation. 채팅 전송 후 세션 목록 캐시 무효화.
 * @참조 chat-room Page
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getAuthHeaders, ApiError } from '../../shared/api/miriartApi';
import { chatResponseSchema, type ChatResponse } from '../../shared/api/schemas/chat';
import type { ChatRequest } from '../../shared/api/miriartApi';

export function useChatMutation() {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
}
