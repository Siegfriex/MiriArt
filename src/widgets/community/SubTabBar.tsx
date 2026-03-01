/**
 * @fileoverview 커뮤니티 서브탭 바. 타임라인 | 질문 Q&A | 인기.
 * 스크롤 시 상단 고정. (sticky 대신 fixed + IntersectionObserver로 확대/줌에서도 안정 동작)
 * @참조 HomeFeed
 */

import React from 'react';
import { FeedTab } from '../../features/community/usePostsFeed';
import { STRINGS } from '../../shared/config/strings';

interface SubTabBarProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  /** 스크롤로 "지나쳐서" 상단에 고정된 상태일 때 true */
  isStuck?: boolean;
}

const TABS: { key: FeedTab; labelKey: 'FEED_TAB_TIMELINE' | 'FEED_TAB_QNA' | 'FEED_TAB_POPULAR' }[] = [
  { key: 'timeline', labelKey: 'FEED_TAB_TIMELINE' },
  { key: 'qna', labelKey: 'FEED_TAB_QNA' },
  { key: 'popular', labelKey: 'FEED_TAB_POPULAR' },
];

const tabBarClasses =
  'z-sticky bg-dark-900 flex border-b border-white/5 w-full';

/** 서브탭 바. 스크롤 지나면 상단 고정. */
export const SubTabBar: React.FC<SubTabBarProps> = ({ activeTab, onTabChange, isStuck = false }) => {
  const tabButtons = (
    <>
      {TABS.map(({ key, labelKey }) => (
        <button
          key={key}
          type="button"
          onClick={() => onTabChange(key)}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === key
              ? 'text-white border-primary-lime'
              : 'text-text-mid border-transparent hover:text-white'
          }`}
        >
          {STRINGS[labelKey]}
        </button>
      ))}
    </>
  );

  return (
    <>
      {isStuck && (
        <div
          className="z-sticky bg-dark-900 flex border-b border-white/5 w-full"
          style={{ position: 'fixed', left: 0, right: 0, top: 0 }}
        >
          {tabButtons}
        </div>
      )}
      {isStuck ? (
        <div className="h-[48px] flex-shrink-0" aria-hidden="true" />
      ) : (
        <div className={tabBarClasses}>{tabButtons}</div>
      )}
    </>
  );
};
