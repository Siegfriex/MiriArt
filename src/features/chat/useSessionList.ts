/**
 * @fileoverview 세션 목록 훅. GET /api/chat/sessions 연동. React Query 기반.
 * @참조 SessionListPanel, SideGNB
 */

import { useQuery } from '@tanstack/react-query';
import { ChatSessionApi } from '../../shared/api/miriartApi';
import type { Session } from '../../shared/model/types';
import type { ChatSessionDto } from '../../shared/api/schemas/chatSession';

function dtoToSession(dto: ChatSessionDto): Session {
  return {
    id: dto.id,
    sessionKey: dto.sessionKey,
    analysisId: dto.analysisId,
    title: dto.title,
    lastMessage: dto.lastMessage,
    messageCount: dto.messageCount,
    grade: dto.grade,
    totalScore: dto.totalScore,
    fixScope: dto.fixScope,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * 채팅 세션 목록 조회. BE GET /api/chat/sessions.
 * @param size 최대 조회 건수 (기본 20)
 * @param grade 필터 등급 (선택)
 */
export function useSessionList(size = 20, grade?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['chatSessions', { size, grade }],
    queryFn: async () => {
      const page = await ChatSessionApi.getList({ page: 0, size, grade });
      return page.content.map(dtoToSession);
    },
  });

  return {
    sessions: data ?? [],
    loading: isLoading,
    error: isError && error instanceof Error ? error.message : (isError ? '세션 목록을 불러오지 못했습니다.' : null),
    refresh: refetch,
  };
}
