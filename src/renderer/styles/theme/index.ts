export const theme = {
  colors: {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#252525',
    bgTertiary: '#2d2d2d',
    textPrimary: '#e0e0e0',
    textSecondary: '#a0a0a0',
    border: '#404040',
    cardBg: '#2d2d2d',
    cardHover: '#3a3a3a',
    accent: '#667eea',
    highlightBg: '#ffd700',
    highlightText: '#000',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
  shadows: {
    default: '0 4px 12px rgba(0, 0, 0, 0.3)',
    hover: '0 6px 16px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 3px rgba(102, 126, 234, 0.3)',
  },
  sidebar: {
    width: 280,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1200px',
    desktop: '1400px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
} as const;

export type Theme = typeof theme;
