import { webDarkTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';

// 自定义 HoloScroll 主题 - 基于 Fluent 2 Dark
export const holoScrollTheme: Partial<Theme> = {
  ...webDarkTheme,
  colorBrandBackground: '#60cdff',
  colorBrandBackgroundHover: '#0093f5',
  colorBrandBackgroundPressed: '#005eb8',
  colorNeutralBackground1: '#0c0c0c',
  colorNeutralBackground2: '#1c1c1c',
  colorNeutralBackground3: '#2d2d2d',
  colorNeutralBackground4: '#292929',
  colorNeutralForeground1: '#ffffff',
  colorNeutralForeground2: '#cccccc',
  colorNeutralForeground3: '#999999',
  colorNeutralStroke1: '#3f3f3f',
  colorNeutralStroke2: '#1f1f1f',
  borderRadiusNone: '0',
  borderRadiusSmall: '2px',
  borderRadiusMedium: '4px',
  borderRadiusLarge: '8px',
  borderRadiusXLarge: '12px',
  fontFamilyBase: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
};

// 技能类别颜色
export const skillCategoryColors = {
  technical: '#60cdff',   // 技术 - 蓝色
  creative: '#ffaa44',    // 创意 - 橙色
  academic: '#00d26a',    // 学术 - 绿色
  social: '#cc99ff',      // 社交 - 紫色
  physical: '#ff6b6b',    // 身体 - 红色
  mindset: '#ffd93d',     // 思维 - 黄色
};

// 成就稀有度颜色
export const rarityColors = {
  common: '#9ca3af',
  rare: '#60cdff',
  epic: '#cc99ff',
  legendary: '#ffaa44',
};
