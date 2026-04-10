// ============================================
// HoloScroll Animation Definitions
// ============================================

export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `,
  fadeInRight: `
    @keyframes fadeInRight {
      from { 
        opacity: 0; 
        transform: translateX(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { 
        opacity: 0; 
        transform: scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `,
  slideOutRight: `
    @keyframes slideOutRight {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(96, 205, 255, 0.3); }
      50% { box-shadow: 0 0 20px rgba(96, 205, 255, 0.6); }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `,
};

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInRight: 'animate-fade-in-right',
  scaleIn: 'animate-scale-in',
  slideInRight: 'animate-slide-in-right',
  slideOutRight: 'animate-slide-out-right',
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  glow: 'animate-glow',
  float: 'animate-float',
};

// 动画持续时间 (毫秒)
export const animationDurations = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
};

// 导出完整动画系统
export const animationSystem = {
  keyframes: animations,
  classes: animationClasses,
  durations: animationDurations,
};

export default animationSystem;
