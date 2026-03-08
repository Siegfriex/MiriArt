/**
 * @fileoverview 평판 뱃지 위젯. REPUTATION_LEVELS 기반, level + badge, size(sm).
 */

import React from 'react';
import { REPUTATION_LEVELS } from '@/entities/community/model/reputation';

export interface ReputationBadgeProps {
  level: number;
  badge?: string;
  size?: 'sm';
}

export const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  level,
  badge,
  size = 'sm',
}) => {
  const info = REPUTATION_LEVELS.find((r) => r.level === level);
  const displayBadge = badge ?? info?.badge ?? '🌱';
  const label = info?.label;
  const isSmall = size === 'sm';
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-text-mid ${isSmall ? 'text-micro' : 'text-caption'}`}
      title={label}
    >
      <span>{displayBadge}</span>
      <span>Lv.{level}</span>
    </span>
  );
};
