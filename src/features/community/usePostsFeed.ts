/**
 * @fileoverview 커뮤니티 피드 목록 훅. 탭/필터 상태 + 피드 데이터.
 * Phase C1 전: MOCK_POSTS 필터링. Phase C1 후: CommunityApi.getPosts() 호출로 교체.
 * @참조 HomeFeed, ContextBar
 */

import { useState, useEffect, useCallback } from 'react';
import { Post } from '../../entities/community/model/post';
import { CommunityApi } from '../../entities/community/api/communityApi';

export type FeedTab = 'timeline' | 'qna' | 'popular';

interface UsePostsFeedReturn {
  posts: Post[];
  activeTab: FeedTab;
  setActiveTab: (tab: FeedTab) => void;
  grade: string;
  setGrade: (g: string) => void;
  domain: string;
  setDomain: (d: string) => void;
  isLoading: boolean;
  loadMore: () => void;
  toggleLike: (postId: string) => void;
}

export function usePostsFeed(
  initialGrade = '',
  initialDomain = ''
): UsePostsFeedReturn {
  const [activeTab, setActiveTab] = useState<FeedTab>('timeline');
  const [grade, setGrade] = useState(initialGrade);
  const [domain, setDomain] = useState(initialDomain);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab === 'qna') params.type = 'qna';
      if (activeTab === 'popular') params.sort = 'popular';
      if (grade) params.grade = grade;
      if (domain) params.domain = domain;

      const result = await CommunityApi.getPosts(params);
      setPosts(result.posts);
    } catch {
      // 에러 시 빈 배열 유지
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, grade, domain]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    // Phase C1에서 cursor 기반 다음 페이지 로드 구현
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1, isLiked: !p.isLiked }
          : p
      )
    );
  }, []);

  return { posts, activeTab, setActiveTab, grade, setGrade, domain, setDomain, isLoading, loadMore, toggleLike };
}
