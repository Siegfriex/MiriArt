/**
 * @fileoverview 커뮤니티 서브탭 바. 타임라인 | 질문 Q&A | 인기.
 * Sticky 적용. 활성 탭 primary-lime 언더라인.
 * @참조 HomeFeed
 */

import React from 'react';
import { FeedTab } from '../../features/community/usePostsFeed';
import { STRINGS } from '../../shared/config/strings';

interface SubTabBarProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const TABS: { key: FeedTab; labelKey: 'FEED_TAB_TIMELINE' | 'FEED_TAB_QNA' | 'FEED_TAB_POPULAR' }[] = [
  { key: 'timeline', labelKey: 'FEED_TAB_TIMELINE' },
  { key: 'qna', labelKey: 'FEED_TAB_QNA' },
  { key: 'popular', labelKey: 'FEED_TAB_POPULAR' },
];

/** 서브탭 바. Sticky. */
export const SubTabBar: React.FC<SubTabBarProps> = ({ activeTab, onTabChange }) => (
  <div className="sticky top-14 z-sticky bg-dark-900 flex border-b border-white/5">
    {TABS.map(({ key, labelKey }) => (
      <button
        key={key}
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
  </div>
);
