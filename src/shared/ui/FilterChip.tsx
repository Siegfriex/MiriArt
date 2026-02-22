/**
 * @fileoverview 필터 칩. label, selected, onClick. 아카이브 필터 등.
 * @참조 Archive Page
 * @라우팅 /app/archive
 * @상태 (부모에서 selected 전달)
 */

import React from 'react';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

/** 필터 칩. label, selected, onClick. @참조 Archive Page */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${
        selected
          ? 'bg-primary-lime text-text-inverse border-primary-lime font-bold'
          : 'bg-transparent text-text-mid border-white/10 hover:border-white/20 hover:text-white'
      } ${className}`}
    >
      {label}
    </button>
  );
};
