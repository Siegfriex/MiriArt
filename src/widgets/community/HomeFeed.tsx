/**
 * @fileoverview 커뮤니티 홈 피드. SubTabBar + PostCard 목록 + 무한스크롤 준비.
 * tab/grade/domain은 useFeedQuery에서 전달해 URL과 동기화.
 * @참조 Home Page, useFeedQuery
 */

import React, { useRef, useEffect } from 'react';
import { SubTabBar } from './SubTabBar';
import { PostCard } from './PostCard';
import { EmptyState } from '../common/EmptyState';
import { usePostsFeed, FeedTab } from '../../features/community/usePostsFeed';
import { STRINGS } from '../../shared/config/strings';

interface HomeFeedProps {
  tab: FeedTab;
  setTab: (tab: FeedTab) => void;
  grade: string;
  setGrade: (grade: string) => void;
  domain: string;
  setDomain: (domain: string) => void;
  onTabChange?: (tab: FeedTab) => void;
}

/** 홈 피드. SubTabBar + PostCard[] + 무한스크롤. */
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
          <EmptyState
            title={STRINGS.FEED_EMPTY_TITLE}
            description={STRINGS.FEED_EMPTY_DESC}
          />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};
