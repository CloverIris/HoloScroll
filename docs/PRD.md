# HoloScroll 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品名称
**HoloScroll | 全息卷轴**

### 1.2 产品定位
一款融合哲学思考与工程设计的个人成长体系化记录与规划工具，将"成长"转化为可计算、可解释、可推荐的动态技能宇宙。

### 1.3 核心理念
- **渐近式哲学**: 成长如同音乐中的渐强符号，层层递进
- **边界与探索**: 可视化能力边界，发现潜在突破口
- **非线性记录**: 多维度并行记录，构建体系化成长网络
- **智能分析**: 数据驱动的成长轨迹分析与建议

---

## 2. 功能模块

### 2.1 技能树 (SkillTree)
**功能描述**: 以可视化方式展示个人技能发展路径

**核心特性**:
- 六维技能分类: 技术、创意、学术、社交、体能、心智
- 力导向图布局 (D3.js)
- 支持拖拽、缩放、全屏
- 技能详情抽屉展示
- 前置依赖关系可视化

**数据模型**:
```typescript
interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  description: string;
  prerequisites: string[];
}
```

### 2.2 时间轴 (Timeline)
**功能描述**: 流式记录成长过程中的重要时刻

**核心特性**:
- 按年月自动分组
- 支持标签筛选
- 快速输入栏
- 事件编辑器
- 多种事件类型: 里程碑、成就、学习、笔记、练习

### 2.3 成就系统 (Achievements)
**功能描述**: 游戏化的成就追踪与展示

**核心特性**:
- 四种稀有度: 普通、稀有、史诗、传说
- 进度追踪
- 成就详情模态框
- 分享功能
- 统计卡片

### 2.4 分析面板 (Analysis)
**功能描述**: 数据驱动的成长分析

**核心特性**:
- 技能六维分布图 (柱状图)
- 成长趋势图 (折线图)
- AI 洞察面板
- 数据导出 (PDF, 图片, JSON)

---

## 3. 技术架构

### 3.1 技术栈
| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 桌面端 | Electron 29 |
| UI 组件库 | Fluent UI v9 |
| 图表 | @fluentui/react-charting |
| 可视化 | D3.js v7 |
| 状态管理 | Zustand |
| 数据库 | Dexie (IndexedDB) |
| 样式 | Tailwind CSS v4 |

### 3.2 项目结构
```
src/
├── components/          # 可复用组件
│   ├── layout/         # 布局组件
│   ├── fluent/         # Fluent UI 封装
│   └── ui/             # 基础 UI 组件
├── pages/              # 页面组件
│   ├── SkillTreePage.tsx
│   ├── TimelinePage.tsx
│   ├── AchievementPage.tsx
│   └── AnalysisPage.tsx
├── styles/             # 样式系统
│   ├── design-system.ts
│   ├── animations.ts
│   └── fluent-theme.ts
├── hooks/              # 自定义 Hooks
├── stores/             # 状态管理
└── utils/              # 工具函数

electron/               # Electron 主进程
├── main.ts
└── preload.ts

scripts/                # 构建脚本
docs/                   # 文档
public/                 # 静态资源
```

---

## 4. 设计系统

### 4.1 颜色系统
| 用途 | 颜色值 |
|------|--------|
| 主背景 | `#0c0c0c` |
| 次背景 | `#1c1c1c` |
| 强调色 | `#60cdff` |
| 文字主色 | `#ffffff` |
| 文字次色 | `rgba(255,255,255,0.7)` |

### 4.2 技能类别色
- 技术: `#60cdff` (蓝)
- 创意: `#ffaa44` (橙)
- 学术: `#00d26a` (绿)
- 社交: `#cc99ff` (紫)
- 体能: `#ff6b6b` (红)
- 心智: `#ffd93d` (黄)

### 4.3 布局规范
- 侧边栏宽度: 260px (可折叠至 72px)
- 圆角: 8px-16px
- 动画时长: 200-300ms
- 毛玻璃效果: `backdrop-filter: blur(20px)`

---

## 5. 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+K` | 打开命令面板 |
| `Ctrl+1` | 切换到技能树 |
| `Ctrl+2` | 切换到时间轴 |
| `Ctrl+3` | 切换到成就 |
| `Ctrl+4` | 切换到分析 |
| `F11` | 全屏切换 |
| `Esc` | 关闭弹窗/取消操作 |

---

## 6. 开发路线图

### Phase 1: 基础架构 ✓
- [x] 项目初始化
- [x] Fluent UI 集成
- [x] 设计系统搭建
- [x] 路由系统

### Phase 2: 核心功能 ✓
- [x] 技能树可视化
- [x] 时间轴记录
- [x] 成就系统
- [x] 分析面板

### Phase 3: 桌面端 ✓
- [x] Electron 集成
- [x] 打包配置
- [x] 自动更新

### Phase 4: 数据持久化 (进行中)
- [ ] IndexedDB 集成
- [ ] 数据导入/导出
- [ ] 云同步

### Phase 5: AI 集成 (规划中)
- [ ] 智能建议
- [ ] 成长预测
- [ ] 自动标签

---

## 7. 贡献指南

### 7.1 开发环境
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# Electron 开发
npm run electron:dev

# 构建
npm run build
npm run electron:build
```

### 7.2 提交规范
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 样式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

---

## 8. 许可证

MIT License - 详见 [LICENSE](../LICENSE)
