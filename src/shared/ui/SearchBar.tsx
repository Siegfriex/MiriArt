/**
 * @fileoverview 검색바. Search 아이콘, input 스타일. 아카이브 검색 등.
 * @참조 Archive Page
 * @라우팅 /app/archive
 * @상태 (부모에서 value/onChange)
 */

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

/** 검색바 컴포넌트. @참조 Archive Page */
export const SearchBar: React.FC<SearchBarProps> = ({
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-low" size={18} />
      <input
        type="text"
        className={`w-full bg-dark-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime placeholder-text-low border border-white/5 ${className}`}
        {...props}
      />
    </div>
  );
};
