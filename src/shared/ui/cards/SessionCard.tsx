/**
 * @fileoverview 세션 카드. session 표시, onClick. 채팅 목록용.
 * @참조 SessionListPanel
 * @라우팅 /app/chat
 * @상태 (부모에서 session 전달)
 */

import React from 'react';
import { Session } from '../../model/types';
import { STRINGS } from '../../config/strings';
import { SignedImage } from '../SignedImage';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

/** 세션 카드. session, onClick. @참조 SessionListPanel */
export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const relativeTime = () => {
    const diff = Date.now() - session.timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    return `${mins}분 전`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-surface-alt rounded-xl p-4 border border-border-default flex gap-4 hover:bg-surface-tertiary active:scale-[0.98] transition-all cursor-pointer group"
    >
      {/* 썸네일 — SignedImage로 실 이미지 표시 */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0 border border-border-default">
        <SignedImage
          analysisId={session.id}
          alt="세션 썸네일"
          className="w-full h-full object-cover opacity-80"
          placeholderClassName="bg-surface-tertiary flex items-center justify-center text-text-low text-[10px]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="text-primary-lime font-bold text-lg drop-shadow-md">{session.grade}</span>
        </div>
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* 상단 행: 학교·전공 + 시간 */}
        <div className="flex justify-between items-start">
          <div className="text-tiny text-primary-lime font-bold uppercase tracking-wide truncate max-w-[65%]">
            {session.university} · {session.major}
          </div>
          <span className="text-micro text-text-mid flex-shrink-0 ml-2">{relativeTime()}</span>
        </div>

        {/* 세션 제목 */}
        <div className="text-sm text-text-primary font-medium truncate group-hover:text-primary-lime transition-colors">
          {session.title}
        </div>

        {/* 하단 행: 마지막 메시지 + fixScope 태그 */}
        <div className="flex justify-between items-end gap-2">
          <div className="text-tiny text-text-mid truncate flex-1">
            {session.lastMessage}
          </div>
          {session.fixScope && (
            <span
              className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                session.fixScope === 'StructureRebuild'
                  ? 'border-semantic-error/30 text-semantic-error bg-semantic-error/10'
                  : 'border-primary-lime/30 text-primary-lime bg-primary-lime/10'
              }`}
            >
              {session.fixScope === 'StructureRebuild'
                ? STRINGS.SESSION_FIXSCOPE_REBUILD
                : STRINGS.SESSION_FIXSCOPE_TUNING}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
