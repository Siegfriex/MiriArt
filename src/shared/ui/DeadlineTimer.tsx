/**
 * @fileoverview Q&A 마감 타이머. ISO 문자열 → "Xh Ym 남음" 실시간 카운트다운 (1분 간격 업데이트).
 * @참조 PostCard, QnaDetailPage
 */

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DeadlineTimerProps {
  deadlineAt: string;
  className?: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '마감됨';
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m 남음`;
  return `${minutes}m 남음`;
}

/** Q&A 마감 타이머. 1분마다 업데이트. */
export const DeadlineTimer: React.FC<DeadlineTimerProps> = ({ deadlineAt, className = '' }) => {
  const [remaining, setRemaining] = useState(() => {
    return new Date(deadlineAt).getTime() - Date.now();
  });

  useEffect(() => {
    const tick = () => setRemaining(new Date(deadlineAt).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [deadlineAt]);

  const isExpired = remaining <= 0;
  const text = formatRemaining(remaining);

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${isExpired ? 'text-text-low' : 'text-semantic-warning'} ${className}`}>
      <Clock size={11} />
      {text}
    </span>
  );
};
