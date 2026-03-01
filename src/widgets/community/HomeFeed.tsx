/**
 * @fileoverview 커뮤니티 홈 피드. SubTabBar + PostCard 목록 + 무한스크롤 준비.
 * tab/grade/domain은 useFeedQuery에서 전달해 URL과 동기화.
 * @참조 Home Page, useFeedQuery
 */

import React, { useRef, useEffect } from 'react';
import { SubTabBar } from './SubTabBar';
import { PostCard } from './PostCard';
import { usePostsFeed, FeedTab } from '../../features/community/usePostsFeed';

interface HomeFeedProps {
  tab: FeedTab;
  setTab: (tab: FeedTab) => void;
  grade: string;
  setGrade: (grade: string) => void;
  domain: string;
  setDomain: (domain: string) => void;
  onTabChange?: (tab: FeedTab) => void;
}

/** 홈 피드. SubTabBar + PostCard[] + IntersectionObserver. */
export const HomeFeed: React.FC<HomeFeedProps> = ({
  tab,
  setTab,
  grade,
  setGrade,
  domain,
  setDomain,
  onTabChange,
}) => {
  const { posts, activeTab, setActiveTab, isLoading, loadMore } = usePostsFeed('', '', {
    tab,
    setTab,
    grade,
    setGrade,
    domain,
    setDomain,
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 트리거 (Phase C1 전은 noop)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div>
      <SubTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="space-y-3 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary-lime border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-text-mid text-sm">
            아직 게시글이 없어요. 첫 글을 작성해보세요!
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};
