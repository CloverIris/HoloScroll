// ============================================
// HoloScroll Design System - Premium Edition
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
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  full: '9999px',
};

// 阴影系统 - 更柔和的多层阴影
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14)',
  md: '0 4px 6px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)',
  lg: '0 10px 15px rgba(0,0,0,0.25), 0 4px 6px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.3), 0 8px 10px rgba(0,0,0,0.08)',
  glow: '0 0 30px rgba(96,205,255,0.25), 0 0 60px rgba(96,205,255,0.1)',
  inner: 'inset 0 1px 2px rgba(255,255,255,0.05)',
};

// 颜色系统 - 更高级的深色主题
export const colors = {
  // 背景层次 - 增加微妙的蓝色调
  bg: {
    primary: '#0a0a0c',      // 主背景 - 略带蓝调的极深黑
    secondary: '#121216',    // 次级背景
    tertiary: '#1a1a20',     // 第三层背景
    elevated: '#22222a',     // 浮起层
    overlay: 'rgba(10,10,12,0.85)', // 遮罩层
  },
  // 边框 - 更精致的透明度层次
  border: {
    subtle: 'rgba(255,255,255,0.04)',
    default: 'rgba(255,255,255,0.08)',
    strong: 'rgba(255,255,255,0.14)',
    accent: 'rgba(96,205,255,0.3)',
  },
  // 文字 - 更精细的层次
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,0.72)',
    tertiary: 'rgba(255,255,255,0.48)',
    disabled: 'rgba(255,255,255,0.28)',
    muted: 'rgba(255,255,255,0.35)',
  },
  // 强调色 - 保留标志性的青色，但增加层次
  accent: {
    DEFAULT: '#60cdff',
    light: '#85d9ff',
    dark: '#3db8f0',
    hover: '#4fc3f7',
    pressed: '#2e9fd4',
    glow: 'rgba(96,205,255,0.35)',
    subtle: 'rgba(96,205,255,0.1)',
  },
  // 技能类别色 - 微调使其更和谐
  skill: {
    technical: '#5eb8ff',   // 技术蓝 - 稍柔和
    creative: '#ffb366',    // 创意橙 - 更暖
    academic: '#4ade80',    // 学术绿 - 更清新
    social: '#c4a5f7',      // 社交紫 - 更优雅
    physical: '#ff7a7a',    // 身体红 - 更柔和
    mindset: '#ffd966',     // 心智黄 - 更温暖
  },
  // 稀有度颜色
  rarity: {
    common: '#9ca3af',
    rare: '#60cdff',
    epic: '#c4a5f7',
    legendary: '#ffb366',
  },
  // 渐变预设
  gradients: {
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
    surfaceHover: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    accent: 'linear-gradient(135deg, #60cdff 0%, #3db8f0 100%)',
    glow: 'radial-gradient(circle, rgba(96,205,255,0.15) 0%, transparent 70%)',
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
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// 动画时间
export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Z-index 层级
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  commandPalette: 9999,
  toast: 10000,
  tooltip: 10100,
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
