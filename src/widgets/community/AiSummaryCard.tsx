/**
 * @fileoverview Q&A AI 요약 카드. status(idle|loading|success|error), summary, onRetry.
 */

import React from 'react';
import { AiLoadingState, AiErrorState } from '@/shared/ui/ai';

export type AiSummaryStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AiSummaryCardProps {
  postId: string;
  status: AiSummaryStatus;
  summary?: string | null;
  onRetry?: () => void;
}

export const AiSummaryCard: React.FC<AiSummaryCardProps> = ({
  status,
  summary,
  onRetry,
}) => {
  if (status === 'loading') {
    return (
      <div className="rounded-medium border border-border-default bg-surface-alt p-4">
        <AiLoadingState
          title="AI가 요약 중이에요"
          description="잠시만 기다려 주세요"
          variant="inline"
        />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="rounded-medium border border-border-default bg-surface-alt p-4">
        <AiErrorState
          title="요약을 불러오지 못했어요"
          onRetry={onRetry}
          variant="inline"
        />
      </div>
    );
  }
  if (status === 'success' && summary) {
    return (
      <div className="rounded-medium border border-border-default bg-surface-alt p-4">
        <h3 className="text-caption font-medium text-text-primary mb-2">AI 요약</h3>
        <p className="text-caption text-text-secondary whitespace-pre-wrap">{summary}</p>
      </div>
    );
  }
  return null;
};
