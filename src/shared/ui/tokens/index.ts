// src/shared/ui/tokens/index.ts (Acting as theme.ts)

/**
 * dysprime Design System Tokens (v1.4)
 * Strict adherence to Typography (§7) and Color Palette (§2.2)
 */

export const theme = {
  colors: {
    primary: {
      lime: '#C2F970', // Brand Action Color
    },
    background: {
      main: '#121212', // Dark 900 (Main BG)
      secondary: '#1E1E1E', // Dark 800 (Cards, Sheets)
      overlay: 'rgba(0, 0, 0, 0.6)', // Modal Backdrop
    },
    surface: {
      glass: 'rgba(255, 255, 255, 0.7)', // Sticky Context Card, Glassmorphism
      glassDim: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#FFFFFF', // High Emphasis
      secondary: '#A1A1AA', // Medium Emphasis (Gray 400 equivalent)
      inverse: '#121212', // On-Primary Text
    },
    semantic: {
      error: '#E53935', // Critical
      info: '#1E88E5', // Safe/Info
      success: '#C2F970', // Same as Primary
    }
  },
  typography: {
    fontFamily: {
      kr: 'SUITE', // Main Korean Font
      en: 'Rubik', // Main English Font
    },
    // §7.2 Type Scale
    scale: {
      h1: {
        size: '32px',
        lineHeight: '42px',
        letterSpacing: '-0.5px',
        weights: { kr: 800, en: 600 } // Extrabold / Semibold
      },
      h2: {
        size: '22px',
        lineHeight: '30px',
        letterSpacing: '-0.2px',
        weights: { kr: 700, en: 500 } // Bold / Medium
      },
      h3: {
        size: '18px',
        lineHeight: '24px',
        letterSpacing: '0px',
        weights: { kr: 500, en: 400 } // Medium / Regular
      },
      body: {
        size: '14px',
        lineHeight: '22px',
        letterSpacing: '0px',
        weights: { kr: 500, en: 300 } // Medium / Light
      }
    }
  },
  layout: {
    zIndex: {
      base: 0,
      sticky: 10,
      overlay: 40,
      modal: 50,
      toast: 60,
    },
    borderRadius: {
      large: '24px', // Modals, Bottom Sheets
      medium: '12px', // Buttons, Cards
      small: '8px',
    },
    blur: {
      default: '20px', // VID Standard Blur
    }
  }
} as const;

export type Theme = typeof theme;
