/**
 * @fileoverview 커뮤니티 홈 피드. SubTabBar + PostCard 목록 + 무한스크롤 준비.
 * tab/grade/domain은 useFeedQuery에서 전달해 URL과 동기화.
 * @참조 Home Page, useFeedQuery
 */

import React, { useRef, useEffect, useState } from 'react';
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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isSubTabStuck, setSubTabStuck] = useState(false);

  // SubTabBar 고정: 스크롤로 sentinel이 위로 지나가면 상단에 fixed로 표시 (확대/줌에서도 안정)
  useEffect(() => {
    const scrollRoot = document.querySelector('main');
    const sentinel = sentinelRef.current;
    if (!scrollRoot || !sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e) setSubTabStuck(!e.isIntersecting);
      },
      { root: scrollRoot, rootMargin: '-1px 0 0 0', threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />
      <SubTabBar activeTab={activeTab} onTabChange={handleTabChange} isStuck={isSubTabStuck} />
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
