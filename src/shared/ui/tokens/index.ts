/**
 * @fileoverview MiriArt 디자인 토큰 v2.0. Primitives → Semantic → Component 3계층. WCAG 2.2 AA 준수.
 * @참조 tailwind.config, 전역 스타일
 * @라우팅 (직접 사용 안 함 - 토큰만 제공)
 * @상태 (직접 사용 안 함)
 */

// ─── Layer 1: Primitives (raw values) ───────────────────────────────────────

/** 원시 토큰: color, spacing, radius, opacity. 라이트 스킴: Primary #4CAF50, Secondary #124975, BG #F3F7F9/#E3EDF3/#FFF, 텍스트 #18242D/#5C6B75/#8B9CA8 */
export const primitives = {
  color: {
    // Primary (green)
    lime400: '#4CAF50',
    lime300: '#66BB6A',
    // Text / dark neutral (라이트 스킴에서 본문·헤더)
    dark900: '#18242D',
    dark800: '#1E2D3D',
    dark700: '#2A3A4A',
    dark600: '#5C6B75',
    white: '#FFFFFF',
    gray400: '#8B9CA8',
    gray500: '#9CA8B2',
    // Status (semantic base + muted 0.12 라이트용)
    red500: '#E53935',
    blue500: '#124975',
    orange500: '#F97316',
    successGreen: '#43A047',
    successGreenMuted: 'rgba(67,160,71,0.12)',
    errorRed: '#E53935',
    errorRedMuted: 'rgba(229,57,53,0.12)',
    warningOrange: '#F97316',
    warningOrangeMuted: 'rgba(249,115,22,0.12)',
    infoBlue: '#124975',
    infoBlueMuted: 'rgba(18,73,117,0.12)',
    // Primary derived (brand dim / border)
    primaryMuted: 'rgba(76,175,80,0.10)',
    primaryBorder: 'rgba(76,175,80,0.30)',
    // Light neutrals (페이지/섹션 배경)
    neutralLight100: '#F3F7F9',
    neutralLight200: '#E3EDF3',
    // Light scheme border (dark900 기반)
    borderDefaultLight: 'rgba(24,36,45,0.08)',
    borderSubtleLight: 'rgba(24,36,45,0.12)',
  },
  spacing: {
    0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
    16: '64px', 20: '80px', 24: '96px',
  },
  radius: {
    sm: '8px', md: '12px', lg: '24px', xl: '32px', full: '9999px',
  },
  opacity: {
    5: 0.05, 10: 0.10, 20: 0.20, 30: 0.30,
    40: 0.40, 50: 0.50, 60: 0.60, 80: 0.80,
  },
} as const;

// ─── Layer 2: Semantic Tokens (intent-driven) ────────────────────────────────

/** 시맨틱 토큰: color, typography, spacing, radius, shadow, blur, motion */
export const semantic = {
  color: {
    bgPrimary: primitives.color.neutralLight100,
    bgSecondary: primitives.color.neutralLight200,
    bgTertiary: primitives.color.white,
    bgOverlay: 'rgba(0,0,0,0.4)',
    textHigh: primitives.color.dark900,
    textMid: primitives.color.dark600,
    textLow: primitives.color.gray500,
    textInverse: primitives.color.white,
    brandPrimary: primitives.color.lime400,
    brandDim: primitives.color.primaryMuted,
    borderDefault: primitives.color.borderDefaultLight,
    borderSubtle: primitives.color.borderSubtleLight,
    borderActive: primitives.color.primaryBorder,
    statusError: primitives.color.errorRed,
    statusErrorMuted: primitives.color.errorRedMuted,
    statusInfo: primitives.color.infoBlue,
    statusInfoMuted: primitives.color.infoBlueMuted,
    statusSuccess: primitives.color.successGreen,
    statusSuccessMuted: primitives.color.successGreenMuted,
    statusWarning: primitives.color.warningOrange,
    statusWarningMuted: primitives.color.warningOrangeMuted,
  },
  typography: {
    fontFamily: {
      primary: ['Rubik', 'SUITE', 'sans-serif'],
      kr: ['SUITE', 'sans-serif'],
    },
    scale: {
      display: { size: '32px', lineHeight: '42px', letterSpacing: '-0.5px', weight: 800 },
      heading: { size: '22px', lineHeight: '30px', letterSpacing: '-0.2px', weight: 700 },
      subhead: { size: '18px', lineHeight: '24px', letterSpacing: '0px', weight: 500 },
      body:    { size: '14px', lineHeight: '22px', letterSpacing: '0px', weight: 500 },
      caption: { size: '12px', lineHeight: '16px', letterSpacing: '0.2px', weight: 400 },
      micro:   { size: '10px', lineHeight: '14px', letterSpacing: '0.3px', weight: 500 },
    },
  },
  spacing: {
    page: { x: 20, y: 24 },
    section: { gap: 24 },
    card: { padding: 16, gap: 12 },
    component: { gap: 8 },
  },
  radius: {
    card: primitives.radius.lg,
    button: primitives.radius.md,
    chip: primitives.radius.full,
    badge: primitives.radius.sm,
  },
  shadow: {
    soft: '0 4px 12px rgba(0,0,0,0.10)',
    glow: '0 0 20px rgba(76,175,80,0.30)',
    elevated: '0 8px 32px rgba(0,0,0,0.40)',
  },
  blur: { glass: '20px' },
  motion: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    spring: { stiffness: 300, damping: 25 },
  },
} as const;

// ─── Layer 3: Z-index 7단계 시맨틱 시스템 ────────────────────────────────────

/** Z-index 계층: base, sticky, nav, overlay, sidebar, modal, priority, toast, critical */
export const zLayers = {
  base: 0,       // 페이지 콘텐츠
  sticky: 10,    // StickyContextCard, 고정 헤더
  nav: 30,       // BottomNav, FAB
  overlay: 40,   // SideGNB backdrop, dim overlay
  sidebar: 45,   // SideGNB 패널 (modal 아래)
  modal: 50,     // GlobalModal (center, bottom-sheet), ArtifactViewer
  priority: 60,  // UploadFlow full, Auth 페이지
  toast: 70,     // Toast 알림
  critical: 90,  // Splash
} as const;

/** Theme 타입 (semantic 토큰) */
export type Theme = typeof semantic;
/** ZLayers 타입 */
export type ZLayers = typeof zLayers;

// ─── 레이아웃·그리드·r값·root 변수 (중앙 관리) ─────────────────────────────────
export * from './layout';
export { getRootVarsObject, injectRootVars } from './rootVars';
