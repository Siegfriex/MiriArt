/**
 * @fileoverview Q&A 답변 채택 훅. useMutation + communityApi.acceptAnswer, 성공 시 상세 invalidation.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/entities/community/api/communityApi';
import { communityKeys } from '@/entities/community/api/communityQueries';

export function useAcceptAnswer(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answerId: string) => communityApi.acceptAnswer(postId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postDetail(postId) });
    },
  });
}
