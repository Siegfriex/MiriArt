/**
 * @fileoverview 좋아요 토글 훅. useMutation + 낙관적 업데이트, 실패 시 롤백.
 * @참조 PostCard, PostDetailPage, QnaDetailPage
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '@/entities/community/api/communityApi';
import { communityKeys } from '@/entities/community/api/communityQueries';
import { handleApiError } from '@/shared/api/miriartApi';
import { useToastStore } from '@/shared/model/toastStore';

export type LikeTargetType = 'post' | 'answer';

export interface UseLikeToggleOptions {
  /** 답변일 때 상세 invalidation용 부모 post id (type이 'post'면 생략 가능) */
  postIdForInvalidation?: string;
  /** 초기 표시값 (낙관적 UI용) */
  initialLiked?: boolean;
  initialCount?: number;
}

/**
 * @param type - 'post' | 'answer'
 * @param id - 대상 엔티티 id (post id 또는 answer id)
 */
export function useLikeToggle(
  type: LikeTargetType,
  id: string,
  options: UseLikeToggleOptions = {}
) {
  const { postIdForInvalidation, initialLiked = false, initialCount = 0 } = options;
  const queryClient = useQueryClient();
  const queryKey = communityKeys.postDetail(postIdForInvalidation ?? id);

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await communityApi.likePost(type, id);
      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        if (type === 'post') {
          const o = old as { isLiked?: boolean; likeCount?: number };
          return { ...old, isLiked: !o.isLiked, likeCount: (o.likeCount ?? 0) + (o.isLiked ? -1 : 1) };
        }
        const o = old as { answers?: Array<{ id: string; isLiked?: boolean; likeCount?: number }> };
        const answers = o.answers?.map((a) => (a.id === id ? { ...a, isLiked: !a.isLiked, likeCount: (a.likeCount ?? 0) + (a.isLiked ? -1 : 1) } : a)) ?? [];
        return { ...o, answers };
      });
      return { previous };
    },
    onError: (err, _variables, context) => {
      if (context?.previous != null) queryClient.setQueryData(queryKey, context.previous);
      useToastStore.getState().show(handleApiError(err), 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
    },
  });

  const isLiked = mutation.isPending ? !initialLiked : initialLiked;
  const count = mutation.isPending ? initialCount + (initialLiked ? -1 : 1) : initialCount;
  return {
    isLiked,
    count,
    toggle: () => mutation.mutate(),
    mutation,
  };
}
