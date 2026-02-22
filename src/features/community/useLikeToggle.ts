/**
 * @fileoverview 좋아요 토글 훅. 낙관적 업데이트 (Phase C1 전: 로컬 상태만).
 * @참조 PostCard, PostDetailPage, QnaDetailPage
 */

import { useState, useCallback } from 'react';

interface LikeState {
  isLiked: boolean;
  count: number;
}

export function useLikeToggle(initialLiked: boolean, initialCount: number) {
  const [state, setState] = useState<LikeState>({ isLiked: initialLiked, count: initialCount });

  const toggle = useCallback(() => {
    setState((prev) => ({
      isLiked: !prev.isLiked,
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
    }));
    // Phase C1 후: await CommunityApi.likePost('post', postId)
  }, []);

  return { ...state, toggle };
}
