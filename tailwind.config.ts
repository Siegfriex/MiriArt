import type { Config } from 'tailwindcss';
import { primitives, zLayers } from './src/shared/ui/tokens/index';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 & 기본 팔레트 (토큰 derive)
        'primary-lime': primitives.color.lime400,
        'primary-lime-dim': primitives.color.lime300,
        dark: {
          900: primitives.color.dark900,
          800: primitives.color.dark800,
          700: primitives.color.dark700,
          600: primitives.color.dark600,
        },
        'text-primary': primitives.color.white,
        'text-secondary': primitives.color.gray400,
        'text-mid': primitives.color.gray400,
        'text-low': primitives.color.gray500,
        'text-inverse': primitives.color.dark900,
        semantic: {
          error: primitives.color.red500,
          info: primitives.color.blue500,
          success: primitives.color.lime400,
          warning: primitives.color.orange500,
        },
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
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0,0,0,0.10)',
        glow: '0 0 20px rgba(194,249,112,0.30)',
        elevated: '0 8px 32px rgba(0,0,0,0.40)',
      },
      backdropBlur: {
        glass: '20px',
      },
      // Z-index 7단계 시맨틱 시스템
      zIndex: {
        base: String(zLayers.base),
        sticky: String(zLayers.sticky),
        nav: String(zLayers.nav),
        overlay: String(zLayers.overlay),
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
      },
    },
  },
  plugins: [],
};

export default config;
