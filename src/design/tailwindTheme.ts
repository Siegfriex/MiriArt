/**
 * design/tokens.ts 값을 Tailwind theme.extend 형태로 변환.
 * tailwind.config.ts 에서 import 해서 extend에 spread.
 * (기존 config의 colors 등과 병합되도록, design 전용 키만 반환)
 */

import { tokens } from './tokens';

export function themeFromDesignTokens() {
  const { colors, typography, spacing, radius, shadow } = tokens;
  return {
    colors: {
      'brand-primary': colors.brand.primary,
      'brand-primary-hover': colors.brand.primaryHover,
      'brand-primary-muted': colors.brand.primaryMuted,
      ...Object.fromEntries(
        Object.entries(colors.neutral).map(([k, v]) => [`neutral-${k}`, v])
      ),
      'semantic-success': colors.semantic.success.default,
      'semantic-success-muted': colors.semantic.success.muted,
      'semantic-warning': colors.semantic.warning.default,
      'semantic-warning-muted': colors.semantic.warning.muted,
      'semantic-error': colors.semantic.error.default,
      'semantic-error-muted': colors.semantic.error.muted,
      'semantic-info': colors.semantic.info.default,
      'semantic-info-muted': colors.semantic.info.muted,
    },
    fontFamily: {
      sans: typography.fontFamily.sans,
      mono: typography.fontFamily.mono,
      kr: typography.fontFamily.kr,
    },
    fontSize: {
      display: [typography.fontScale.display.fontSize, { lineHeight: typography.fontScale.display.lineHeight, letterSpacing: typography.fontScale.display.letterSpacing }],
      heading: [typography.fontScale.heading.fontSize, { lineHeight: typography.fontScale.heading.lineHeight, letterSpacing: typography.fontScale.heading.letterSpacing }],
      subhead: [typography.fontScale.subhead.fontSize, { lineHeight: typography.fontScale.subhead.lineHeight }],
      body: [typography.fontScale.body.fontSize, { lineHeight: typography.fontScale.body.lineHeight }],
      caption: [typography.fontScale.caption.fontSize, { lineHeight: typography.fontScale.caption.lineHeight }],
      micro: [typography.fontScale.micro.fontSize, { lineHeight: typography.fontScale.micro.lineHeight }],
    },
    fontWeight: typography.fontWeight,
    spacing: { ...spacing },
    borderRadius: {
      xs: radius.xs,
      sm: radius.sm,
      md: radius.md,
      lg: radius.lg,
      full: radius.full,
    },
    boxShadow: {
      'token-sm': shadow.sm,
      'token-md': shadow.md,
      'token-lg': shadow.lg,
    },
  };
}

/**
 * 기존 tailwind theme.extend를 덮어쓰지 않고, design 토큰에서 추가할 키만 반환.
 * tailwind.config에서 extend: { ...existing, ...themeFromDesignTokensAdditive() } 로 사용.
 */
export function themeFromDesignTokensAdditive() {
  const { colors, radius, shadow } = tokens;
  return {
    colors: {
      'brand-primary': colors.brand.primary,
      'brand-primary-hover': colors.brand.primaryHover,
      'brand-primary-muted': colors.brand.primaryMuted,
      ...Object.fromEntries(
        Object.entries(colors.neutral).map(([k, v]) => [`neutral-${k}`, v])
      ),
      'semantic-success': colors.semantic.success.default,
      'semantic-success-muted': colors.semantic.success.muted,
      'semantic-warning': colors.semantic.warning.default,
      'semantic-warning-muted': colors.semantic.warning.muted,
      'semantic-error': colors.semantic.error.default,
      'semantic-error-muted': colors.semantic.error.muted,
      'semantic-info': colors.semantic.info.default,
      'semantic-info-muted': colors.semantic.info.muted,
    },
    borderRadius: {
      xs: radius.xs,
      sm: radius.sm,
      md: radius.md,
      lg: radius.lg,
      full: radius.full,
    },
    boxShadow: {
      'token-sm': shadow.sm,
      'token-md': shadow.md,
      'token-lg': shadow.lg,
    },
  };
}
