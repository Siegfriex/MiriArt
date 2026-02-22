/**
 * @fileoverview 세션 엔티티. Session 타입은 shared/model/types. Mock 데이터는 __mocks__/sessions.
 * @참조 SessionListPanel, SessionCard, chat-room Page
 * @라우팅 /app/chat, /chat/:sessionId
 * @상태 (직접 사용 안 함 - Mock/API 데이터)
 */

// Mock 데이터 헬퍼 — __mocks__에서 re-export (하위 호환)
export { MOCK_SESSIONS, getSessions } from '../../__mocks__/sessions';
