# HoloScroll 开发指南

## 环境要求

- Node.js 18+
- npm 9+
- Windows 10/11 (开发桌面端)

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd HoloScroll
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式

**Web 开发**:
```bash
npm run dev
```

**Electron 开发**:
```bash
npm run electron:dev
```

### 4. 构建

**Web 构建**:
```bash
npm run build
```

**Electron 构建**:
```bash
# 构建所有平台
npm run electron:build

# 仅 Windows
npm run electron:build:win

# 仅 macOS
npm run electron:build:mac

# 仅 Linux
npm run electron:build:linux
```

---

## 项目结构

```
HoloScroll/
├── docs/                   # 文档
│   ├── PRD.md             # 产品需求文档
│   ├── ARCHITECTURE.md    # 架构文档
│   └── DEVELOPMENT.md     # 开发指南 (本文件)
├── electron/              # Electron 主进程
│   ├── main.ts           # 主进程入口
│   └── preload.ts        # 预加载脚本
├── scripts/               # 构建脚本
│   └── build-electron.cjs
├── src/                   # 源代码
│   ├── components/        # 组件
│   │   ├── fluent/       # Fluent UI 封装
│   │   ├── layout/       # 布局组件
│   │   └── ui/           # UI 组件
│   ├── pages/            # 页面
│   ├── styles/           # 样式系统
│   ├── hooks/            # 自定义 Hooks
│   └── stores/           # 状态管理
├── public/               # 静态资源
└── package.json
```

---

## 开发规范

### 1. 代码风格

- 使用 TypeScript 严格模式
- 函数式组件 + Hooks
- 命名规范:
  - 组件: PascalCase (e.g., `SkillTreePage`)
  - 函数: camelCase (e.g., `useSkillStore`)
  - 常量: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
  - 类型: PascalCase + Type 后缀 (e.g., `SkillType`)

### 2. 组件结构

```typescript
// 导入排序: React -> 第三方库 -> 本地模块
import { useState, useCallback } from 'react';
import { Button } from '@fluentui/react-components';
import { useSkillStore } from '../stores/skillStore';

// 类型定义
interface SkillCardProps {
  skill: Skill;
  onClick?: (skill: Skill) => void;
}

// 样式定义
const useStyles = makeStyles({
  card: {
    // 样式定义
  },
});

// 组件实现
export function SkillCard({ skill, onClick }: SkillCardProps) {
  const styles = useStyles();
  
  // hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 事件处理
  const handleClick = useCallback(() => {
    onClick?.(skill);
  }, [skill, onClick]);
  
  // 渲染
  return (
    <div className={styles.card} onClick={handleClick}>
      {/* 内容 */}
    </div>
  );
}
```

### 3. 样式系统

使用设计系统定义的值：

```typescript
import { colors, spacing, radius, typography } from '../styles/design-system';

const useStyles = makeStyles({
  container: {
    backgroundColor: colors.bg.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    fontSize: typography.sizes.md,
  },
});
```

---

## 添加新页面

1. **创建页面组件**:
```bash
touch src/pages/NewPage.tsx
```

2. **实现页面**:
```typescript
import { Title1 } from '@fluentui/react-components';
import { PageLayout } from '../components/layout/PageLayout';

export function NewPage() {
  return (
    <PageLayout>
      <Title1>新页面</Title1>
    </PageLayout>
  );
}
```

3. **添加到路由**:
在 `AppLayout.tsx` 中添加页面映射。

4. **添加到侧边栏**:
在 `Sidebar.tsx` 中添加导航项。

---

## 调试技巧

### Electron 调试

1. **打开 DevTools**:
   - 开发模式自动打开
   - 生产模式按 `F12`

2. **查看日志**:
```bash
# Windows
%USERPROFILE%\AppData\Roaming\HoloScroll\logs
```

3. **调试主进程**:
```bash
npm run electron:dev -- --inspect=5858
```

### 常见问题

**问题**: 构建后白屏
- **解决**: 检查控制台错误，通常是导入问题

**问题**: Fluent UI 图标不显示
- **解决**: 确认使用 `@fluentui/react-icons` 中的图标

**问题**: D3 图表不渲染
- **解决**: 检查容器尺寸是否正确

---

## 发布流程

1. **更新版本**:
```bash
npm version patch  # 或 minor, major
```

2. **构建并打包**:
```bash
npm run electron:build:win
```

3. **产物位置**:
```
release/
├── HoloScroll Setup <version>.exe     # 安装程序
├── HoloScroll-Portable-<version>.exe  # 便携版
└── win-unpacked/                      # 未打包版本
```

---

## 贡献流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feat/feature-name`
3. 提交更改: `git commit -m "feat: add feature"`
4. 推送到分支: `git push origin feat/feature-name`
5. 创建 Pull Request

### 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型:
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

示例:
```
feat(skilltree): add zoom controls

- Add zoom in/out buttons
- Add fit-to-screen functionality
- Persist zoom level in localStorage

Closes #123
```
