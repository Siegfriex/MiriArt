/**
 * @fileoverview 태그 칩. 디스플레이 전용 (선택 상태 없음).
 * @참조 PostCard, PostDetailPage, QnaDetailPage, WritePostPage
 */

import React from 'react';

interface TagChipProps {
  label: string;
  className?: string;
}

/** 태그 칩. bg-primary-lime/10 배경. */
export const TagChip: React.FC<TagChipProps> = ({ label, className = '' }) => (
  <span
    className={`inline-block bg-primary-lime/10 text-primary-lime text-tiny px-2 py-0.5 rounded-full font-medium ${className}`}
  >
    {label}
  </span>
);
