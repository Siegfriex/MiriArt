/**
 * @fileoverview TanStack Query 옵션 및 queryKey 팩토리. 피드·상세·평판 조회.
 */

import type { UseInfiniteQueryOptions, UseQueryOptions } from '@tanstack/react-query';
import { communityApi } from './communityApi';
import type { Post, PostDetail } from '@/entities/community/model/types';

export type PostFeedParams = {
  type?: string;
  sort?: string;
  grade?: string;
  domain?: string;
  size?: number;
};

export const communityKeys = {
  all: ['community'] as const,
  posts: (params?: PostFeedParams) => [...communityKeys.all, 'posts', params] as const,
  postDetail: (id: string) => [...communityKeys.all, 'post', id] as const,
  reputation: (userId: string) => [...communityKeys.all, 'reputation', userId] as const,
};

export function postFeedOptions(params: PostFeedParams = {}): UseInfiniteQueryOptions<
  { posts: Post[]; nextCursor: string | null },
  Error,
  { posts: Post[]; nextCursor: string | null },
  { posts: Post[]; nextCursor: string | null },
  readonly unknown[]
> {
  return {
    queryKey: communityKeys.posts(params),
    queryFn: async ({ pageParam }) => {
      const result = await communityApi.getPosts({
        ...params,
        cursor: pageParam as string | undefined,
        size: params.size ?? 20,
      });
      return { posts: result.posts, nextCursor: result.nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  };
}

export function postDetailOptions(postId: string): UseQueryOptions<PostDetail, Error> {
  return {
    queryKey: communityKeys.postDetail(postId),
    queryFn: () => communityApi.getPost(postId),
  };
}

export function reputationOptions(userId: string): UseQueryOptions<{ score: number; level: number; badge: string }, Error> {
  return {
    queryKey: communityKeys.reputation(userId),
    queryFn: () => communityApi.getReputation(userId),
  };
}
