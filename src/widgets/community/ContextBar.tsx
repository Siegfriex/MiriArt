/**
 * @fileoverview 홈 탭 컨텍스트 바. 학년/도메인 필터 + 알림/검색 아이콘.
 * useUserStore 기본값 세팅. 변경 시 피드 필터 즉시 반영.
 * @참조 Home Page
 */

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Select } from '../../shared/ui/Select';
import { GRADE_OPTIONS, DOMAIN_OPTIONS } from '../../shared/config/community';

interface ContextBarProps {
  grade: string;
  domain: string;
  onGradeChange: (g: string) => void;
  onDomainChange: (d: string) => void;
}

/** 홈 탭 컨텍스트 바. 학년/도메인 select + 알림/검색. */
export const ContextBar: React.FC<ContextBarProps> = ({
  grade, domain, onGradeChange, onDomainChange,
}) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-border-default">
    <div className="flex items-center gap-2">
      <Select
        size="sm"
        value={grade || GRADE_OPTIONS[0]}
        onChange={(e) => onGradeChange(e.target.value === GRADE_OPTIONS[0] ? '' : e.target.value)}
        aria-label="학년 필터"
      >
        {GRADE_OPTIONS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </Select>
      <Select
        size="sm"
        value={domain || DOMAIN_OPTIONS[0]}
        onChange={(e) => onDomainChange(e.target.value === DOMAIN_OPTIONS[0] ? '' : e.target.value)}
        aria-label="도메인 필터"
      >
        {DOMAIN_OPTIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
    </div>
    <div className="flex items-center gap-3">
      <button className="text-text-mid hover:text-text-primary transition-colors p-1" aria-label="알림">
        <Bell size={18} />
      </button>
      <button className="text-text-mid hover:text-text-primary transition-colors p-1" aria-label="검색">
        <Search size={18} />
      </button>
    </div>
  </div>
);
