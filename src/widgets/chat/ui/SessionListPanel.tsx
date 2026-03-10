/**
 * @fileoverview 세션 목록 패널. 필터, SessionCard 목록, FAB(새 채팅). SideGNB 내부에 표시.
 * @참조 SideGNB
 * @라우팅 /app/chat (SideGNB 열림 시)
 * @상태 useModalStore, useSideGNBStore, useUserStore, useSessionList, useState (selectedFilter)
 */

import React, { useState, useMemo } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { Session, Grade } from '../../../shared/model/types';
import { useSessionList } from '../../../features/chat/useSessionList';
import { FAB } from '../../../shared/ui/FAB';
import { SearchBar } from '../../../shared/ui/SearchBar';
import { FilterChip } from '../../../shared/ui/FilterChip';
import { SessionCard } from '../../../shared/ui/cards/SessionCard';
import { EmptyState } from '../../../widgets/common/EmptyState';
import { MessageSquareDashed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../shared/model/modalStore';
import { useSideGNBStore } from '../../../shared/model/sideGNBStore';
import { useUserStore } from '../../../shared/model/userStore';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';

interface SessionListPanelProps {
  compact?: boolean;
}

const FILTERS = ['전체', 'A등급', 'B등급'];

/** 세션 목록 패널. compact. @참조 SideGNB @상태 useModalStore, useSideGNBStore, useUserStore, useSessionList */
export const SessionListPanel: React.FC<SessionListPanelProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { close: closeSideGNB } = useSideGNBStore();
  const { profile } = useUserStore();
  const [selectedFilter, setSelectedFilter] = useState('전체');

  const { sessions, loading, error } = useSessionList();

  const filteredSessions = useMemo(() => {
    if (selectedFilter === '전체') return sessions;
    if (selectedFilter === 'A등급') return sessions.filter((s) => s.grade === Grade.A);
    if (selectedFilter === 'B등급') return sessions.filter((s) => s.grade === Grade.B);
    return sessions.filter((s) => s.university.includes(selectedFilter));
  }, [selectedFilter, sessions]);

  const handleSessionClick = (session: Session) => {
    closeSideGNB();
    navigate(ROUTES.CHAT_ROOM(session.id));
  };

  const handleNewChat = () => {
    openModal('UPLOAD_FLOW', {
      onComplete: () => navigate(ROUTES.CHAT_ROOM('new-session')),
    });
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-full' : 'min-h-full'} relative bg-surface`}>
      {!compact && (
        <header className="flex justify-between items-center px-page-x pt-page-y pb-2">
          <H1 className="text-text-primary">{STRINGS.CHAT_TITLE}</H1>
          <div className="text-xs text-text-mid">
            {STRINGS.CHAT_CREDITS(profile.credits)}
          </div>
        </header>
      )}

      <div className={`flex flex-col gap-4 ${compact ? 'px-page-x pt-4' : 'px-page-x'} flex-1 overflow-y-auto no-scrollbar pb-bottom-nav`}>
        <SearchBar placeholder={STRINGS.CHAT_SEARCH_PLACEHOLDER} />

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              selected={selectedFilter === filter}
              onClick={() => setSelectedFilter(filter)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface-alt rounded-xl animate-pulse" />
            ))
          ) : error ? (
            <EmptyState
              title="불러오기 실패"
              description={error}
              actionLabel="다시 시도"
              onAction={() => window.location.reload()}
              icon={MessageSquareDashed}
            />
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => handleSessionClick(session)}
              />
            ))
          ) : (
            <EmptyState
              title={STRINGS.CHAT_EMPTY_TITLE}
              description={STRINGS.CHAT_EMPTY_DESC}
              actionLabel={STRINGS.CHAT_EMPTY_ACTION}
              onAction={handleNewChat}
              icon={MessageSquareDashed}
            />
          )}
        </div>
      </div>

      <FAB onClick={handleNewChat} />
    </div>
  );
};
