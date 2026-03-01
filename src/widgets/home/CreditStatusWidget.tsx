/**
 * @fileoverview 크레딧 상태 위젯. credits/maxCredits 표시, onUpgrade 버튼.
 * @참조 Home Page, Profile Page
 * @라우팅 /app/home, /app/profile
 * @상태 (부모에서 credits, onUpgrade 전달)
 */

import React from 'react';
import { Button } from '../../shared/ui/Button';
import { Zap } from 'lucide-react';
import { STRINGS } from '../../shared/config/strings';

interface CreditStatusWidgetProps {
  credits: number;
  maxCredits?: number;
  onUpgrade?: () => void;
}

/** 크레딧 상태 위젯. credits, maxCredits, onUpgrade. @참조 Home, Profile */
export const CreditStatusWidget: React.FC<CreditStatusWidgetProps> = ({
  credits,
  maxCredits = 20,
  onUpgrade,
}) => {
  const percentage = Math.min((credits / maxCredits) * 100, 100);

  return (
    <div className="rounded-xl bg-dark-800 p-4 border border-white/5 flex justify-between items-center gap-3 relative overflow-visible">
      <div
        className="absolute bottom-0 left-0 h-1 bg-primary-lime/20 transition-all duration-700"
        style={{ width: `${percentage}%` }}
      />

      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-primary-lime/10 flex items-center justify-center border border-primary-lime/20 flex-shrink-0">
          <Zap className="text-primary-lime" size={20} fill="currentColor" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-text-mid mb-0.5">{STRINGS.PROFILE_CREDITS_LABEL}</div>
          <div className="text-xl font-bold text-white font-sans leading-none">
            {credits}{' '}
            <span className="text-sm text-text-low font-normal">/ {maxCredits}</span>
          </div>
        </div>
      </div>

      <Button variant="secondary" className="flex-shrink-0 px-4 py-2 h-auto text-xs" onClick={onUpgrade}>
        {STRINGS.PROFILE_CREDITS_CHARGE}
      </Button>
    </div>
  );
};
