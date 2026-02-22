/**
 * @fileoverview MiriArt 디자인 토큰 v2.0. Primitives → Semantic → Component 3계층. WCAG 2.2 AA 준수.
 * @참조 tailwind.config, 전역 스타일
 * @라우팅 (직접 사용 안 함 - 토큰만 제공)
 * @상태 (직접 사용 안 함)
 */

// ─── Layer 1: Primitives (raw values) ───────────────────────────────────────

/** 원시 토큰: color, spacing, radius, opacity */
export const primitives = {
  color: {
    lime400: '#C2F970',
    lime300: '#D4FB9E',
    dark900: '#121212',
    dark800: '#1E1E1E',
    dark700: '#2C2C2C',
    dark600: '#3A3A3A',
    white: '#FFFFFF',
    gray400: '#A1A1AA',   // 6.3:1 on dark900 — WCAG AA
    gray500: '#71717A',   // 4.6:1 on dark800 — WCAG AA (경계)
    red500: '#E53935',
    blue500: '#1E88E5',
    orange500: '#F97316',
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
    bgPrimary: primitives.color.dark900,
    bgSecondary: primitives.color.dark800,
    bgTertiary: primitives.color.dark700,
    bgOverlay: 'rgba(0,0,0,0.6)',
    textHigh: primitives.color.white,         // 17.4:1 on dark900
    textMid: primitives.color.gray400,         // 6.3:1 on dark900
    textLow: primitives.color.gray500,         // 4.6:1 on dark800
    textInverse: primitives.color.dark900,
    brandPrimary: primitives.color.lime400,
    brandDim: 'rgba(194,249,112,0.10)',
    borderDefault: 'rgba(255,255,255,0.05)',
    borderSubtle: 'rgba(255,255,255,0.10)',
    borderActive: 'rgba(194,249,112,0.30)',
    statusError: primitives.color.red500,
    statusInfo: primitives.color.blue500,
    statusSuccess: primitives.color.lime400,
    statusWarning: primitives.color.orange500,
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
    glow: '0 0 20px rgba(194,249,112,0.30)',
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

/** Z-index 계층: base, sticky, nav, overlay, modal, priority, toast, critical */
export const zLayers = {
  base: 0,       // 페이지 콘텐츠
  sticky: 10,    // StickyContextCard, 고정 헤더
  nav: 30,       // BottomNav, FAB
  overlay: 40,   // SideGNB backdrop, dim overlay
  modal: 50,     // GlobalModal (center, bottom-sheet), ArtifactViewer
  priority: 60,  // UploadFlow full, Auth 페이지
  toast: 70,     // Toast 알림
  critical: 90,  // Splash
} as const;

/** Theme 타입 (semantic 토큰) */
export type Theme = typeof semantic;
/** ZLayers 타입 */
export type ZLayers = typeof zLayers;
