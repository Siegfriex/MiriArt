/**
 * MiriArt 디자인 토큰 스켈레톤 v1
 * - 색 SSOT: shared/ui/tokens (primitives + semantic) 재사용.
 * - Tailwind config 및 컴포넌트에서 import 해서 사용.
 */

import { primitives, semantic } from '../shared/ui/tokens';

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

// ─── 1. Colors (shared primitives/semantic 기반) ─────────────────────────────

const colors = {
  brand: {
    primary: primitives.color.lime400,
    primaryHover: primitives.color.lime300,
    primaryMuted: primitives.color.primaryMuted,
  },
  neutral: {
    0: primitives.color.white,
    100: primitives.color.neutralLight100,
    200: primitives.color.neutralLight200,
    300: primitives.color.gray400,
    400: primitives.color.gray400,
    500: primitives.color.gray500,
    600: primitives.color.dark600,
    700: primitives.color.dark700,
    800: primitives.color.dark800,
    900: primitives.color.dark900,
  },
  semantic: {
    success: { default: semantic.color.statusSuccess, muted: semantic.color.statusSuccessMuted },
    warning: { default: semantic.color.statusWarning, muted: semantic.color.statusWarningMuted },
    error: { default: semantic.color.statusError, muted: semantic.color.statusErrorMuted },
    info: { default: semantic.color.statusInfo, muted: semantic.color.statusInfoMuted },
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
