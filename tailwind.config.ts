
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        // VID v1.4 §2.2 Color Palette
        primary: {
          lime: '#C2F970',
        },
        semantic: {
          critical: '#E53935',
          safe: '#1E88E5',
        },
        dark: {
          900: '#121212', // Main background
          800: '#1E1E1E', // Secondary background
          700: '#2C2C2C', // Borders
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          inverse: '#121212',
        }
      },
      fontFamily: {
        // VID v1.4 §2.1 Typography
        sans: ['Rubik', 'SUITE', 'sans-serif'], // English First for numbers/punctuations
        kr: ['SUITE', 'sans-serif'],
      },
      fontSize: {
        // VID v1.4 §7.2 Type Scale
        'display': ['32px', { lineHeight: '42px', letterSpacing: '-0.5px' }],
        'heading': ['22px', { lineHeight: '30px', letterSpacing: '-0.2px' }],
        'subhead': ['18px', { lineHeight: '24px', letterSpacing: '0px' }],
        'body': ['14px', { lineHeight: '22px', letterSpacing: '0px' }],
      },
      fontWeight: {
        // Mapping for SUITE/Rubik
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        'large': '24px', // VID v1.4 §2.3
        'medium': '12px',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(194, 249, 112, 0.3)',
      },
      backdropBlur: {
        'glass': '20px', // VID v1.4 §5.2
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-up': 'springUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        }
      }
    },
  },
  plugins: [],
};
export default config;
