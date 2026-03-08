/**
 * @fileoverview AI 로딩 상태. title, description, progress, estimatedTime, variant( inline | fullscreen ).
 */

import React from 'react';

export interface AiLoadingStateProps {
  title: string;
  description?: string;
  progress?: number;
  estimatedTime?: string;
  variant?: 'inline' | 'fullscreen';
}

export const AiLoadingState: React.FC<AiLoadingStateProps> = ({
  title,
  description,
  progress,
  estimatedTime,
  variant = 'inline',
}) => {
  const isFull = variant === 'fullscreen';
  return (
    <div
      className={
        isFull
          ? 'fixed inset-0 z-overlay flex flex-col items-center justify-center gap-4 bg-surface/95'
          : 'flex flex-col items-center justify-center gap-3 py-6'
      }
    >
      <div className="w-8 h-8 border-2 border-primary-lime border-t-transparent rounded-full animate-spin" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && <p className="text-caption text-text-mid">{description}</p>}
      </div>
      {progress != null && (
        <div className="w-full max-w-[200px] h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-lime transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      {estimatedTime && (
        <p className="text-micro text-text-low">{estimatedTime}</p>
      )}
    </div>
  );
};
