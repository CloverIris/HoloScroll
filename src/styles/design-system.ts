// ============================================
// HoloScroll Design System
// ============================================

// 间距系统
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

// 圆角系统
export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// 阴影系统
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.3)',
  md: '0 4px 8px rgba(0,0,0,0.4)',
  lg: '0 8px 16px rgba(0,0,0,0.5)',
  xl: '0 16px 32px rgba(0,0,0,0.6)',
  glow: '0 0 20px rgba(96,205,255,0.3)',
};

// 颜色系统
export const colors = {
  bg: {
    primary: '#0c0c0c',
    secondary: '#141414',
    tertiary: '#1e1e1e',
    elevated: '#242424',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    default: 'rgba(255,255,255,0.12)',
    strong: 'rgba(255,255,255,0.18)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,0.7)',
    tertiary: 'rgba(255,255,255,0.45)',
    disabled: 'rgba(255,255,255,0.3)',
  },
  accent: {
    DEFAULT: '#60cdff',
    hover: '#4ba8d4',
    pressed: '#3d8ab0',
    glow: 'rgba(96,205,255,0.3)',
  },
  skill: {
    technical: '#60cdff',
    creative: '#ffaa44',
    academic: '#00d26a',
    social: '#cc99ff',
    physical: '#ff6b6b',
    mindset: '#ffd93d',
  },
  rarity: {
    common: '#9ca3af',
    rare: '#60cdff',
    epic: '#cc99ff',
    legendary: '#ffaa44',
  },
};

// 字体系统
export const typography = {
  fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif",
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// 动画时间
export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Z-index 层级
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
};

// 导出完整设计系统
export const designSystem = {
  spacing,
  radius,
  shadows,
  colors,
  typography,
  transitions,
  zIndex,
};

export default designSystem;
