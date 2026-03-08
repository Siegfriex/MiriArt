/**
 * @fileoverview 댓글 작성 훅. useMutation + communityApi.createComment, 성공 시 상세 invalidation, 실패 시 handleApiError 토스트.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/entities/community/api/communityApi';
import { communityKeys } from '@/entities/community/api/communityQueries';
import type { CommentParentType } from '@/entities/community/model/comment';
import { handleApiError } from '@/shared/api/miriartApi';
import { useToastStore } from '@/shared/model/toastStore';

export interface CreateCommentParams {
  parentType: CommentParentType;
  parentId: string;
  content: string;
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateCommentParams) => communityApi.createComment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.postDetail(postId) });
    },
    onError: (err) => {
      useToastStore.getState().show(handleApiError(err), 'error');
    },
  });
}
