/**
 * @fileoverview AI 에러 상태. onRetry, secondaryAction(업그레이드 등).
 */

import React from 'react';

export interface AiErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
  variant?: 'inline' | 'fullscreen';
}

export const AiErrorState: React.FC<AiErrorStateProps> = ({
  title = '오류가 발생했어요',
  description,
  onRetry,
  secondaryAction,
  variant = 'inline',
}) => {
  const isFull = variant === 'fullscreen';
  return (
    <div
      className={
        isFull
          ? 'fixed inset-0 z-overlay flex flex-col items-center justify-center gap-4 bg-surface p-4'
          : 'flex flex-col items-center justify-center gap-4 py-8'
      }
    >
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-semantic-error">{title}</p>
        {description && <p className="text-caption text-text-mid">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium rounded-medium bg-primary-lime text-dark-900 hover:opacity-90 transition-opacity"
          >
            다시 시도
          </button>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="px-4 py-2 text-sm font-medium rounded-medium border border-border-default text-text-primary hover:bg-surface-alt transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};
