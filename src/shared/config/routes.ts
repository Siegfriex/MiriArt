/**
 * @fileoverview MiriArt 라우트 상수. 모든 경로 중앙 관리. navigate() 호출 시 이 상수 사용.
 * @참조 AppRouter, BottomNav, SideGNB, chat-room Page, result-detail Page, SessionListPanel 등
 * @라우팅 SPLASH(/), ONBOARDING, AUTH, TUTORIAL, APP/*, CHAT_ROOM, RESULT
 * @상태 (직접 사용 안 함 - 상수만 제공)
 */

export const ROUTES = {
  SPLASH: '/',
  ONBOARDING: '/onboarding',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  TUTORIAL: '/tutorial',
  APP: {
    ROOT: '/app',
    HOME: '/app/home',
    ARCHIVE: '/app/archive',
    CHAT: '/app/chat',
    PROFILE: '/app/profile',
  },
  CHAT_ROOM: (sessionId: string) => `/chat/${sessionId}`,
  RESULT: (artworkId: string) => `/result/${artworkId}`,
  POST_DETAIL: (id: string) => `/posts/${id}`,
  QNA_DETAIL: (id: string) => `/qna/${id}`,
  WRITE: '/write',
} as const;
