/**
 * @fileoverview 가명 아바타. 익명 사용자 표시. displayName + grade/domain + 레벨 뱃지.
 * @참조 PostCard, PostDetailPage, QnaDetailPage
 */

import React from 'react';
import { getBadge } from '../../entities/community/model/reputation';

interface PersonaAvatarProps {
  displayName: string;
  colorToken: string;
  grade?: string;
  domain?: string;
  reputationLevel?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const SIZE_CLASS = {
  xs: 'w-5 h-5 text-micro',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
} as const;

/** 가명 아바타. 색상 배경 + 닉네임 + 학년/도메인 + 레벨 뱃지. */
export const PersonaAvatar: React.FC<PersonaAvatarProps> = ({
  displayName,
  colorToken,
  grade,
  domain,
  reputationLevel,
  size = 'md',
}) => {
  const avatarSize = SIZE_CLASS[size];
  const initial = displayName.charAt(displayName.length - 1);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${avatarSize} rounded-full flex items-center justify-center font-bold text-dark-900 flex-shrink-0 bg-[var(--avatar-color)]`}
        style={{ ['--avatar-color' as string]: colorToken }}
      >
        {initial}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-xs text-text-primary font-medium">{displayName}</span>
          {reputationLevel !== undefined && (
            <span className="text-micro text-text-mid">
              {getBadge(reputationLevel)} Lv.{reputationLevel}
            </span>
          )}
        </div>
        {(grade || domain) && (
          <span className="text-micro text-text-mid">
            {[grade, domain].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
    </div>
  );
};
