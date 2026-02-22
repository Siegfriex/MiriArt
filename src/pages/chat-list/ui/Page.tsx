/**
 * @fileoverview AI 채팅 목록 페이지. SessionListPanel 래퍼. AI Chat 탭 시 SideGNB Full이 열리므로 fallback 라우트.
 * @참조 AppRouter
 * @라우팅 /app/chat
 * @상태 (직접 사용 안 함 - SessionListPanel 내부)
 */

import React from 'react';
import { SessionListPanel } from '../../../widgets/chat/SessionListPanel';

/** AI 채팅 목록. @참조 AppRouter */
export const AIChatList: React.FC = () => {
  return <SessionListPanel />;
};
