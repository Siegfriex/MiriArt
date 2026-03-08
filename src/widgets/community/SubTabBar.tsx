/**
 * @fileoverview 커뮤니티 서브탭 바. 타임라인 | 질문 Q&A | 인기.
 * 페이지 본문 흐름 내 일반 블록. 플로팅/고정 없음.
 * @참조 HomeFeed
 */

import React from 'react';
import { FeedTab } from '@/entities/community/lib/feedTabToParams';
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

/** 서브탭 바. 본문 흐름 내 블록(스크롤 시 함께 올라감). */
export const SubTabBar: React.FC<SubTabBarProps> = ({ activeTab, onTabChange }) => (
  <div className="bg-surface flex border-b border-border-default w-full">
    {TABS.map(({ key, labelKey }) => (
      <button
        key={key}
        type="button"
        onClick={() => onTabChange(key)}
        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
          activeTab === key
            ? 'text-text-primary border-primary-lime'
            : 'text-text-mid border-transparent hover:text-text-primary'
        }`}
      >
        {STRINGS[labelKey]}
      </button>
    ))}
  </div>
);
