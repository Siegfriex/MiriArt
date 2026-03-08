/**
 * @fileoverview 커뮤니티 피드 목록 훅. useInfiniteQuery 기반. params는 FEED_TAB_PARAMS[activeTab] + grade, domain.
 * @참조 HomeFeed, feedTabToParams, communityQueries
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { postFeedOptions, type PostFeedParams } from '@/entities/community/api/communityQueries';
import type { Post } from '@/entities/community/model/post';

export interface UsePostsFeedParams extends PostFeedParams {
  grade?: string;
  domain?: string;
}

export interface UsePostsFeedReturn {
  posts: Post[];
  isPending: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
  refetch: () => void;
}

export function usePostsFeed(params: UsePostsFeedParams = {}): UsePostsFeedReturn {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = useInfiniteQuery(
    postFeedOptions(params)
  );
  const posts = data?.pages.flatMap((p) => p.posts) ?? [];
  return {
    posts,
    isPending,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    error: error ?? null,
    refetch,
  };
}
