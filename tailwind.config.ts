import type { Config } from 'tailwindcss';
import { primitives, zLayers, semantic } from './src/shared/ui/tokens/index';
import { contentMaxWidth, grid, pagePadding, sectionGap, cardGap, bottomNavHeightPx } from './src/shared/ui/tokens/layout';
import { themeFromDesignTokensAdditive } from './src/design/tailwindTheme';

const designThemeAdditive = themeFromDesignTokensAdditive();

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // design additive 먼저 spread 후 shared(semantic)로 덮어써서 SSOT 유지
        ...designThemeAdditive.colors,
        // 브랜드 & 기본 팔레트 (primitives)
        'primary-lime': primitives.color.lime400,
        'primary-lime-dim': primitives.color.lime300,
        dark: {
          900: primitives.color.dark900,
          800: primitives.color.dark800,
          700: primitives.color.dark700,
          600: primitives.color.dark600,
        },
        // 라이트 스킴: text/surface = semantic 기반
        'text-primary': semantic.color.textHigh,
        'text-secondary': semantic.color.textMid,
        'text-mid': semantic.color.textMid,
        'text-low': semantic.color.textLow,
        'text-disabled': semantic.color.textDisabled,
        'text-inverse': semantic.color.textInverse,
        surface: semantic.color.bgPrimary,
        'surface-alt': semantic.color.bgSecondary,
        'surface-tertiary': semantic.color.bgTertiary,
        muted: semantic.color.textMid,
        'muted-alt': semantic.color.textLow,
        'border-default': semantic.color.borderDefault,
        'border-subtle': semantic.color.borderSubtle,
        semantic: {
          error: semantic.color.statusError,
          'error-muted': semantic.color.statusErrorMuted,
          info: semantic.color.statusInfo,
          'info-muted': semantic.color.statusInfoMuted,
          success: semantic.color.statusSuccess,
          'success-muted': semantic.color.statusSuccessMuted,
          warning: semantic.color.statusWarning,
          'warning-muted': semantic.color.statusWarningMuted,
        },
        // semantic-* 캐밥 키 (shared 우선)
        'semantic-error': semantic.color.statusError,
        'semantic-error-muted': semantic.color.statusErrorMuted,
        'semantic-info': semantic.color.statusInfo,
        'semantic-info-muted': semantic.color.statusInfoMuted,
        'semantic-success': semantic.color.statusSuccess,
        'semantic-success-muted': semantic.color.statusSuccessMuted,
        'semantic-warning': semantic.color.statusWarning,
        'semantic-warning-muted': semantic.color.statusWarningMuted,
      },
      fontFamily: {
        sans: ['Rubik', 'SUITE', 'sans-serif'],
        kr: ['SUITE', 'sans-serif'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '42px', letterSpacing: '-0.5px' }],
        heading: ['22px', { lineHeight: '30px', letterSpacing: '-0.2px' }],
        subhead: ['18px', { lineHeight: '24px', letterSpacing: '0px' }],
        body:    ['14px', { lineHeight: '22px', letterSpacing: '0px' }],
        caption: ['12px', { lineHeight: '16px', letterSpacing: '0.2px' }],
        micro:   ['10px', { lineHeight: '14px', letterSpacing: '0.3px' }],
        tiny:    ['11px', { lineHeight: '14px', letterSpacing: '0.2px' }],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        large: '24px',
        medium: '12px',
        small: '8px',
        ...designThemeAdditive.borderRadius,
      },
      boxShadow: {
        soft: semantic.shadow.soft,
        glow: semantic.shadow.glow,
        elevated: semantic.shadow.elevated,
        ...designThemeAdditive.boxShadow,
      },
      backdropBlur: {
        glass: '20px',
      },
      // 레이아웃·그리드 (tokens/layout.ts 단일 소스)
      maxWidth: {
        'content-xs': `${contentMaxWidth.xs}px`,
        'content-sm': `${contentMaxWidth.sm}px`,
        'content-md': `${contentMaxWidth.md}px`,
        'content-lg': `${contentMaxWidth.lg}px`,
      },
      spacing: {
        'page-x': `${pagePadding.x}px`,
        'page-y': `${pagePadding.y}px`,
        'section-gap': `${sectionGap}px`,
        'card-gap': `${cardGap}px`,
        'bottom-nav': `${bottomNavHeightPx}px`,
      },
      gridTemplateColumns: {
        'content-1': `repeat(${grid.columns.narrow}, minmax(0, 1fr))`,
        'content-2': `repeat(${grid.columns.default}, minmax(0, 1fr))`,
        'content-3': `repeat(${grid.columns.wide}, minmax(0, 1fr))`,
        'content-5': `repeat(${grid.columns.gallery}, minmax(0, 1fr))`,
      },
      // Z-index 7단계 시맨틱 시스템 (+ sidebar)
      zIndex: {
        base: String(zLayers.base),
        sticky: String(zLayers.sticky),
        nav: String(zLayers.nav),
        overlay: String(zLayers.overlay),
        sidebar: String(zLayers.sidebar),
        modal: String(zLayers.modal),
        priority: String(zLayers.priority),
        toast: String(zLayers.toast),
        critical: String(zLayers.critical),
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-up': 'springUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 20s linear infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        springUp: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
