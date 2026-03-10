/**
 * @fileoverview 세션 카드. BE GET /api/chat/sessions 응답(Session) 표시, onClick. 채팅 목록용.
 * @참조 SessionListPanel, SideGNB
 */

import React from 'react';
import { Session } from '../../model/types';
import { STRINGS } from '../../config/strings';
import { SignedImage } from '../SignedImage';
import { MessageCircle } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

function relativeTime(updatedAt: string): string {
  const ts = new Date(updatedAt).getTime();
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  return `${mins}분 전`;
}

/** 세션 카드. session(sessionKey, analysisId, title, updatedAt 등), onClick. @참조 SessionListPanel */
export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-surface-alt rounded-xl p-4 border border-border-default flex gap-4 hover:bg-surface-tertiary active:scale-[0.98] transition-all cursor-pointer group"
    >
      {/* 썸네일 — analysisId 있으면 SignedImage, 없으면 자유 채팅 플레이스홀더 */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0 border border-border-default">
        {session.analysisId != null ? (
          <>
            <SignedImage
              analysisId={String(session.analysisId)}
              alt="세션 썸네일"
              className="w-full h-full object-cover opacity-80"
              placeholderClassName="bg-surface-tertiary flex items-center justify-center text-text-low text-[10px]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-primary-lime font-bold text-lg drop-shadow-md">{session.grade ?? '—'}</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-tertiary text-text-mid">
            <MessageCircle size={24} />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* 상단 행: 제목 + 시간 */}
        <div className="flex justify-between items-start">
          <div className="text-tiny text-primary-lime font-bold uppercase tracking-wide truncate max-w-[65%]">
            {session.title}
          </div>
          <span className="text-micro text-text-mid flex-shrink-0 ml-2">{relativeTime(session.updatedAt)}</span>
        </div>

        {/* 메시지 수·등급 (선택 표시) */}
        <div className="text-sm text-text-primary font-medium truncate group-hover:text-primary-lime transition-colors">
          {session.messageCount > 0 ? `${session.messageCount}개 메시지` : '대화 없음'}
        </div>

        {/* 하단 행: 마지막 메시지 + fixScope 태그 */}
        <div className="flex justify-between items-end gap-2">
          <div className="text-tiny text-text-mid truncate flex-1">
            {session.lastMessage ?? ''}
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
