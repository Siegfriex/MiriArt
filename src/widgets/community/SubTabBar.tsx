/**
 * @fileoverview 커뮤니티 서브탭 바. 타임라인 | 질문 Q&A | 인기.
 * Sticky 적용. 활성 탭 primary-lime 언더라인.
 * @참조 HomeFeed
 */

import React from 'react';
import { FeedTab } from '../../features/community/usePostsFeed';

interface SubTabBarProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const TABS: { key: FeedTab; label: string }[] = [
  { key: 'timeline', label: '타임라인' },
  { key: 'qna', label: '질문 Q&A' },
  { key: 'popular', label: '인기' },
];

/** 서브탭 바. Sticky. */
export const SubTabBar: React.FC<SubTabBarProps> = ({ activeTab, onTabChange }) => (
  <div className="sticky top-14 z-sticky bg-dark-900 flex border-b border-white/5">
    {TABS.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => onTabChange(key)}
        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
          activeTab === key
            ? 'text-white border-primary-lime'
            : 'text-text-mid border-transparent hover:text-white'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
