/**
 * @fileoverview MiriArt UI 문자열 중앙 관리. 홈 탭 관련 문자열 포함.
 * @상태 (직접 사용 안 함 - 문자열만 제공)
 */

export const STRINGS = {
  APP_NAME: 'MiriArt',
  CONFIRM: '확인',
  CANCEL: '취소',
  BACK: '뒤로가기',
  CLOSE: '닫기',

  // ─── BottomNav ─────────────────────────────────────────────────────────────
  NAV_HOME: '홈',
  NAV_ARCHIVE: '아카이브',
  NAV_CHAT: 'AI 상담',
  NAV_PROFILE: '프로필',

  // ─── Home ───────────────────────────────────────────────────────────────────
  HOME_PLAN_BADGE: '기본 플랜',
  HOME_UPLOAD_CTA_TITLE: '분석 시작',
  HOME_UPLOAD_CTA_DESC: '작품을 업로드하면 AI가 8초 안에 피드백을 드려요.',
  HOME_UPLOAD_BUTTON: '작품 업로드',
  HOME_RECENT_TITLE: '최근 분석',
  HOME_RECENT_VIEW_ALL: '전체 보기',
  HOME_FIRST_LOGIN_TOOLTIP: '첫 작품을 업로드해보세요!',

  // ─── Profile (CreditStatusWidget) ──────────────────────────────────────────
  PROFILE_CREDITS_LABEL: '사용 가능 크레딧',
  PROFILE_CREDITS_CHARGE: '충전하기',

  // ─── Live Ticker ────────────────────────────────────────────────────────────
  TICKER_ITEMS: [
    'User293님이 기초디자인에서 A등급을 달성했습니다.',
    '홍익대 기초조형 합격 확률이 User102님께 계산되었습니다.',
    '새 분석이 7.2초 만에 완료되었습니다.',
    'User888님이 프리미엄 플랜으로 업그레이드했습니다.',
    '오늘 총 128개의 작품이 분석되었습니다.',
  ],
} as const;
