/**
 * @fileoverview 좋아요 버튼. count, isLiked, onToggle, size(sm).
 */

import React from 'react';
import { Heart } from 'lucide-react';

export interface LikeButtonProps {
  count: number;
  isLiked: boolean;
  onToggle: () => void;
  size?: 'sm';
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  count,
  isLiked,
  onToggle,
  size = 'sm',
}) => {
  const isSmall = size === 'sm';
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1 text-text-mid hover:text-semantic-error transition-colors ${
        isSmall ? 'text-caption' : 'text-sm'
      } ${isLiked ? 'text-semantic-error' : ''}`}
      aria-pressed={isLiked}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        size={isSmall ? 14 : 18}
        className={isLiked ? 'fill-current' : ''}
      />
      <span>{count}</span>
    </button>
  );
};
