/**
 * @fileoverview 검색바. Search 아이콘, input 스타일. 아카이브 검색 등.
 * @참조 Archive Page
 * @라우팅 /app/archive
 * @상태 (부모에서 value/onChange)
 */

import React from 'react';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { TextInput } from './TextInput';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

/** 검색바 컴포넌트. @참조 Archive Page */
export const SearchBar: React.FC<SearchBarProps> = ({
  containerClassName = '',
  className,
  ...props
}) => (
  <div className={`relative ${containerClassName}`}>
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-low pointer-events-none"
      size={18}
      aria-hidden
    />
    <TextInput
      type="text"
      className={clsx('pl-10', className)}
      size="md"
      {...props}
    />
  </div>
);
