# HoloScroll 架构文档

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Electron 容器                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   渲染进程 (Chromium)                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   SkillTree │ │   Timeline  │ │Achievements │   │   │
│  │  │    Page     │ │    Page     │ │    Page     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │              Fluent UI v9 组件层              │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │                React 19 + Vite                │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│  ┌───────────────────────┴───────────────────────────┐     │
│  │                  主进程 (Node.js)                  │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │     │
│  │  │  窗口管理   │  │   IPC 通信   │  │ 文件系统 │  │     │
│  │  └─────────────┘  └─────────────┘  └──────────┘  │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 通信机制

```
渲染进程 (React)  <--IPC-->  预加载脚本  <--IPC-->  主进程 (Electron)
       │                        │                        │
       └─ contextBridge ────────┘                        │
                                                         └─ Node.js APIs
```

---

## 2. 前端架构

### 2.1 组件分层

```
┌─────────────────────────────────────┐
│           Page Components           │
│  (SkillTreePage, TimelinePage...)   │
├─────────────────────────────────────┤
│         Layout Components           │
│  (AppLayout, Sidebar, Header...)    │
├─────────────────────────────────────┤
│         Feature Components          │
│  (CommandPalette, Acrylic, Toast)   │
├─────────────────────────────────────┤
│          UI Components              │
│      (Fluent UI v9 Wrapper)         │
├─────────────────────────────────────┤
│         Design System               │
│   (colors, spacing, typography)     │
└─────────────────────────────────────┘
```

### 2.2 状态管理

使用 Zustand 进行状态管理：

```typescript
// 技能状态
interface SkillStore {
  skills: Skill[];
  selectedSkill: Skill | null;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  selectSkill: (skill: Skill | null) => void;
}

// 成就状态
interface AchievementStore {
  achievements: Achievement[];
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
}
```

---

## 3. 构建流程

### 3.1 开发流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│   npm    │ -> │  Vite    │ -> │ 浏览器   │
│ run dev  │    │  dev sv  │    │ (React)  │
└──────────┘    └──────────┘    └──────────┘
```

### 3.2 生产构建

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  npm     │ -> │  Vite    │ -> │  dist/   │
│  build   │    │  build   │    │ (web)    │
└──────────┘    └──────────┘    └──────────┘
                                       │
                                       v
┌──────────┐    ┌──────────┐    ┌──────────┐
│electron: │ -> │ 编译 TS  │ -> │dist-electron/
│build-ts  │    │         │    │         │
└──────────┘    └──────────┘    └──────────┘
                                       │
                                       v
                              ┌──────────────┐
                              │electron-builder│
                              │ 打包为可执行文件│
                              └──────────────┘
```

---

## 4. 关键实现

### 4.1 技能树 (D3.js)

```typescript
// 力导向图配置
const simulation = d3.forceSimulation<NodeDatum>(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(140))
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(60));

// 缩放行为
const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent([0.3, 3])
  .on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
```

### 4.2 Fluent UI 主题

```typescript
// 自定义主题
export const holoScrollTheme: Partial<Theme> = {
  ...webDarkTheme,
  colorBrandBackground: '#60cdff',
  colorBrandBackgroundHover: '#0093f5',
  colorNeutralBackground1: '#0c0c0c',
  colorNeutralBackground2: '#1c1c1c',
};
```

### 4.3 毛玻璃效果

```typescript
const useStyles = makeStyles({
  acrylic: {
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
});
```

---

## 5. 性能优化

### 5.1 已实施
- [x] Terser 代码压缩
- [x] Tree Shaking
- [x] 按需加载 Fluent UI 组件
- [x] 使用 `useMemo` 和 `useCallback` 优化渲染

### 5.2 计划中
- [ ] 路由懒加载
- [ ] 虚拟滚动 (时间轴)
- [ ] Service Worker 缓存
- [ ] 图片懒加载

---

## 6. 安全考虑

### 6.1 Electron 安全
- `contextIsolation: true` - 启用上下文隔离
- `nodeIntegration: false` - 禁用 Node 集成
- 使用 `preload` 脚本进行受控 IPC 通信

### 6.2 数据安全
- 本地 IndexedDB 存储
- 数据导出加密 (规划中)

---

## 7. 扩展点

### 7.1 插件系统 (规划中)
```typescript
interface Plugin {
  name: string;
  version: string;
  activate: (context: PluginContext) => void;
  deactivate: () => void;
}
```

### 7.2 主题系统
支持自定义主题覆盖：
```typescript
const customTheme = mergeThemes(holoScrollTheme, userOverrides);
```
