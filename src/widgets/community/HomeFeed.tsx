/**
 * @fileoverview 커뮤니티 홈 피드. SubTabBar + PostCard 목록 + 무한스크롤.
 * tab/grade/domain은 useFeedQuery에서 전달해 URL과 동기화.
 * @참조 Home Page, useFeedQuery
 */

import React, { useRef, useEffect } from 'react';
import { SubTabBar } from './SubTabBar';
import { PostCard } from './PostCard';
import { EmptyState } from '../common/EmptyState';
import { usePostsFeed } from '@/features/community/usePostsFeed';
import { FEED_TAB_PARAMS, type FeedTab } from '@/entities/community/lib/feedTabToParams';
import { STRINGS } from '@/shared/config/strings';

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
  const { posts, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } = usePostsFeed({
    ...FEED_TAB_PARAMS[tab],
    grade,
    domain,
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [fetchNextPage, hasNextPage]);

  const handleTabChange = (tab: FeedTab) => {
    setTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div>
      <SubTabBar activeTab={tab} onTabChange={handleTabChange} />
      <div className="space-y-3 p-4">
        {isPending ? (
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
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-primary-lime border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};
