/**
 * @fileoverview MiriArt 라우트 상수. 홈 탭 관련 경로.
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
} as const;
