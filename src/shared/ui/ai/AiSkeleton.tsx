/**
 * @fileoverview AI 스켈레톤. shimmer 애니메이션.
 */

import React from 'react';

export interface AiSkeletonProps {
  className?: string;
  /** 줄 수 (텍스트 블록일 때) */
  lines?: number;
}

export const AiSkeleton: React.FC<AiSkeletonProps> = ({ className = '', lines }) => {
  if (lines != null && lines > 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-surface-tertiary relative overflow-hidden isolate before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
            style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`rounded-medium bg-surface-tertiary relative overflow-hidden isolate before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
      style={{ minHeight: '80px' }}
    />
  );
};
