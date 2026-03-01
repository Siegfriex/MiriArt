/**
 * MiriArt 디자인 토큰 스켈레톤 v1
 * - Tailwind config 및 컴포넌트에서 import 해서 사용.
 * - 실제 값은 디자인 시스템 오너가 조정 가능.
 * - 타입 정의로 자동완성·타입체크 지원.
 */

// ─── 타입 정의 (자동완성·타입체크) ───────────────────────────────────────────

export type ColorToken = string;
export type SpacingToken = string;
export type RadiusToken = string;
export type ShadowToken = string;

export interface TypographyScaleEntry {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  fontWeight?: number;
}

export interface DesignTokens {
  colors: {
    brand: Record<'primary' | 'primaryHover' | 'primaryMuted', ColorToken>;
    neutral: Record<string, ColorToken>;
    semantic: {
      success: Record<'default' | 'muted', ColorToken>;
      warning: Record<'default' | 'muted', ColorToken>;
      error: Record<'default' | 'muted', ColorToken>;
      info: Record<'default' | 'muted', ColorToken>;
    };
  };
  typography: {
    fontFamily: Record<'sans' | 'mono' | 'kr', string[]>;
    fontScale: Record<'display' | 'heading' | 'subhead' | 'body' | 'caption' | 'micro', TypographyScaleEntry>;
    fontWeight: Record<'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold', string>;
  };
  spacing: Record<string, SpacingToken>;
  radius: Record<'xs' | 'sm' | 'md' | 'lg' | 'full', RadiusToken>;
  shadow: Record<'sm' | 'md' | 'lg', ShadowToken>;
}

// ─── 1. Colors ──────────────────────────────────────────────────────────────

const colors = {
  brand: {
    primary: '#C2F970',
    primaryHover: '#B8F060',
    primaryMuted: 'rgba(194, 249, 112, 0.15)',
  },
  neutral: {
    0: '#FFFFFF',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#3A3A3A',
    700: '#2C2C2C',
    800: '#1E1E1E',
    900: '#121212',
  },
  semantic: {
    success: { default: '#22C55E', muted: 'rgba(34, 197, 94, 0.15)' },
    warning: { default: '#F97316', muted: 'rgba(249, 115, 22, 0.15)' },
    error: { default: '#E53935', muted: 'rgba(229, 57, 53, 0.15)' },
    info: { default: '#1E88E5', muted: 'rgba(30, 136, 229, 0.15)' },
  },
} as const;

// ─── 2. Typography ───────────────────────────────────────────────────────────

const typography = {
  fontFamily: {
    sans: ['Rubik', 'SUITE', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
    kr: ['SUITE', 'sans-serif'],
  },
  fontScale: {
    display: { fontSize: '32px', lineHeight: '42px', letterSpacing: '-0.5px', fontWeight: 800 },
    heading: { fontSize: '22px', lineHeight: '30px', letterSpacing: '-0.2px', fontWeight: 700 },
    subhead: { fontSize: '18px', lineHeight: '24px', letterSpacing: '0', fontWeight: 500 },
    body: { fontSize: '14px', lineHeight: '22px', letterSpacing: '0', fontWeight: 500 },
    caption: { fontSize: '12px', lineHeight: '16px', letterSpacing: '0.2px', fontWeight: 400 },
    micro: { fontSize: '10px', lineHeight: '14px', letterSpacing: '0.3px', fontWeight: 500 },
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// ─── 3. Spacing (4px 단위 스케일) ───────────────────────────────────────────

const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// ─── 4. Radius ───────────────────────────────────────────────────────────────

const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '24px',
  full: '9999px',
} as const;

// ─── 5. Shadow ───────────────────────────────────────────────────────────────

const shadow = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 16px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.24)',
} as const;

// ─── 통합 토큰 객체 & export ────────────────────────────────────────────────

export const tokens: DesignTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
};

// 리터럴 타입 (키 자동완성용)
export type BrandColorKey = keyof typeof colors.brand;
export type NeutralColorKey = keyof typeof colors.neutral;
export type SemanticKey = keyof typeof colors.semantic;
export type SemanticVariantKey = keyof typeof colors.semantic.success;
export type SpacingKey = keyof typeof spacing;
export type RadiusKey = keyof typeof radius;
export type ShadowKey = keyof typeof shadow;
export type FontScaleKey = keyof typeof typography.fontScale;
export type FontWeightKey = keyof typeof typography.fontWeight;

export default tokens;
