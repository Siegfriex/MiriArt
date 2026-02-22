/**
 * @fileoverview 홈 탭 컨텍스트 바. 학년/도메인 필터 + 알림/검색 아이콘.
 * useUserStore 기본값 세팅. 변경 시 피드 필터 즉시 반영.
 * @참조 Home Page
 */

import React from 'react';
import { Bell, Search } from 'lucide-react';

const GRADE_OPTIONS = ['전체', '고1', '고2', '고3', '재수', 'N수'];
const DOMAIN_OPTIONS = ['전체', '기초디자인', '수채화', '소묘', '사고의전환', '만화·애니'];

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
  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
    <div className="flex items-center gap-2">
      <select
        value={grade || '전체'}
        onChange={(e) => onGradeChange(e.target.value === '전체' ? '' : e.target.value)}
        className="bg-dark-800 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-lime"
      >
        {GRADE_OPTIONS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <select
        value={domain || '전체'}
        onChange={(e) => onDomainChange(e.target.value === '전체' ? '' : e.target.value)}
        className="bg-dark-800 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary-lime"
      >
        {DOMAIN_OPTIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-3">
      <button className="text-text-mid hover:text-white transition-colors p-1" aria-label="알림">
        <Bell size={18} />
      </button>
      <button className="text-text-mid hover:text-white transition-colors p-1" aria-label="검색">
        <Search size={18} />
      </button>
    </div>
  </div>
);
