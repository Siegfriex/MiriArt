/**
 * @fileoverview AI 생각 중 표시. 점 3개 애니메이션.
 */

import React from 'react';

export const AiThinkingDots: React.FC = () => (
  <div className="flex items-center gap-1">
    <span className="w-2 h-2 rounded-full bg-primary-lime animate-pulse [animation-delay:0ms]" />
    <span className="w-2 h-2 rounded-full bg-primary-lime animate-pulse [animation-delay:150ms]" />
    <span className="w-2 h-2 rounded-full bg-primary-lime animate-pulse [animation-delay:300ms]" />
  </div>
);
