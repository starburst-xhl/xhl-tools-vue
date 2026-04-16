# XHL Tools 设计系统文档

## 📖 概述

本文档定义了 XHL Tools 在线工具箱的完整设计系统，包括设计原则、设计令牌、组件规范和最佳实践。设计系统旨在确保项目视觉一致性和用户体验统一性。

## 🎨 设计原则

### 1. 清晰性 (Clarity)
- 层次分明，信息架构清晰
- 避免视觉干扰，突出核心功能
- 使用足够的留白和对比度

### 2. 一致性 (Consistency)
- 统一的视觉语言和交互模式
- 相同功能使用相同的组件样式
- 遵循设计令牌系统

### 3. 高效性 (Efficiency)
- 快速完成任务，减少认知负担
- 直观的交互流程
- 响应式设计，适配多设备

### 4. 友好性 (Friendliness)
- 温暖的橙色主调
- 友好的交互反馈
- 渐进式引导

## 🎯 设计令牌 (Design Tokens)

设计令牌是设计系统的核心，通过 CSS Variables 实现，确保整个应用的视觉一致性。

### 色彩体系

#### 主色系统
```css
--color-primary: #ff9b17           /* 主色 */
--color-primary-light: #ffb84d     /* 主色浅色 */
--color-primary-dark: #e68a00      /* 主色深色 */
--color-primary-bg: #fff8f0        /* 主色背景 */
--color-primary-bg-light: #fffbf5  /* 主色浅背景 */
```

**使用场景：**
- 主要按钮、链接、图标
- 选中状态、悬停状态
- 品牌标识

#### 中性色系统
```css
--color-text-title: #1a1a1a        /* 标题文字 */
--color-text-primary: #262626      /* 主要文字 */
--color-text-secondary: #666666    /* 次要文字 */
--color-text-tertiary: #8c8c8c     /* 辅助文字 */
--color-text-disabled: #bfbfbf     /* 禁用文字 */

--color-border: #d9d9d9            /* 边框 */
--color-border-light: #f0f0f0      /* 浅边框 */

--color-bg: #fafafa                /* 页面背景 */
--color-bg-component: #ffffff      /* 组件背景 */
--color-bg-hover: #f5f5f5          /* 悬停背景 */
```

**使用场景：**
- 文本内容、边框、分割线
- 背景色、禁用状态

#### 功能色系统
```css
--color-success: #52c41a           /* 成功绿 */
--color-warning: #faad14           /* 警告橙 */
--color-error: #ff4d4f             /* 错误红 */
--color-info: #1890ff              /* 信息蓝 */
```

**使用场景：**
- 成功、警告、错误、信息提示
- 状态标签

### 排版规范

#### 字号层级
```css
--font-size-display: 48px          /* 超大标题 */
--font-size-h1: 36px               /* 一级标题 */
--font-size-h2: 28px               /* 二级标题 */
--font-size-h3: 20px               /* 三级标题 */
--font-size-h4: 18px               /* 四级标题 */
--font-size-h5: 16px               /* 五级标题 */
--font-size-body: 14px             /* 正文 */
--font-size-body-sm: 13px          /* 小号正文 */
--font-size-caption: 12px          /* 辅助文字 */
```

**使用场景：**
- Display: 首页大标题
- H1: 页面主标题
- H2: 区块标题
- H3: 卡片标题
- H4: 小标题
- Body: 正文内容
- Caption: 辅助信息

#### 字重
```css
--font-weight-regular: 400         /* 常规 */
--font-weight-medium: 500          /* 中等 */
--font-weight-semibold: 600        /* 半粗 */
--font-weight-bold: 700            /* 粗体 */
```

**使用场景：**
- Regular: 正文内容
- Medium: 导航、标签
- Semibold: 小标题、强调文字
- Bold: 大标题、重要信息

#### 行高
```css
--line-height-heading: 1.4         /* 标题行高 */
--line-height-body: 1.6            /* 正文行高 */
--line-height-caption: 1.5         /* 辅助文字行高 */
```

### 间距体系

基于 **8px** 基准单位，确保间距的一致性和节奏感。

```css
--spacing-xs: 4px                  /* 超小间距 */
--spacing-sm: 8px                  /* 小间距 */
--spacing-md-sm: 12px              /* 中小间距 */
--spacing-md: 16px                 /* 中等间距 */
--spacing-md-lg: 20px              /* 中大间距 */
--spacing-lg: 24px                 /* 大间距 */
--spacing-xl: 32px                 /* 较大间距 */
--spacing-xxl: 40px                /* 超大间距 */
--spacing-xxxl: 48px               /* 特大间距 */
--spacing-xxxxl: 64px              /* 巨大间距 */
```

**使用场景：**
- xs: 图标与文字间距
- sm: 元素内部间距
- md: 组件内边距
- lg: 组件外边距
- xl: 区块间距
- xxl以上: 大区块间距

### 圆角规范

```css
--radius-sm: 4px                   /* 小圆角 - 按钮、标签 */
--radius-md-sm: 6px                /* 中小圆角 - 小组件 */
--radius-md: 8px                   /* 中等圆角 - 输入框 */
--radius-md-lg: 10px               /* 中大圆角 - 中等组件 */
--radius-lg: 12px                  /* 大圆角 - 卡片、容器 */
--radius-xl: 16px                  /* 超大圆角 - 大容器 */
--radius-xxl: 20px                 /* 特大圆角 - 徽章 */
--radius-full: 9999px              /* 全圆 */
```

**使用场景：**
- sm: 小按钮、标签
- md: 输入框、小组件
- lg: 卡片、容器
- xl: 大卡片
- full: 圆形头像、徽章

### 阴影层级

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08)      /* 轻微阴影 */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12)     /* 中等阴影 */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16)     /* 重阴影 */
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.20)    /* 超重阴影 */
```

**使用场景：**
- sm: 卡片默认状态
- md: 下拉菜单、悬停卡片
- lg: 模态框、浮动组件
- xl: 重要弹窗

### 过渡动画

```css
--duration-fast: 0.15s             /* 快速动画 */
--duration-normal: 0.3s            /* 常规动画 */
--duration-slow: 0.5s              /* 慢速动画 */

--easing-standard: cubic-bezier(0.4, 0, 0.2, 1)
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1)

--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

**使用场景：**
- fast: 按钮悬停、图标变化
- normal: 卡片动画、展开收起
- slow: 页面过渡、大型动画

### 响应式断点

```css
--breakpoint-mobile: 768px         /* 移动端断点 */
--breakpoint-tablet: 1024px        /* 平板断点 */
--breakpoint-desktop: 1280px       /* 桌面断点 */
--breakpoint-wide: 1440px          /* 大屏断点 */
```

## 🧩 组件规范

### 布局组件

#### 顶部导航栏 (HeadBar)
- 高度: 64px
- 背景: 白色
- 边框: 底部 1px 浅灰边框
- 无阴影（与侧边栏保持一致）
- 定位: sticky，top: 0

#### 侧边菜单 (SideMenu)
- 宽度: 240px
- 背景: 白色
- 边框: 右侧 1px 浅灰边框
- 内边距: 16px 0
- **响应式行为**:
  - 桌面端 (≥ 768px): 固定显示在左侧
  - 移动端 (< 768px): 浮动覆盖，收起时左移 -240px
  - 收起按钮: 固定定位，top: 72px，left: 16px

#### 工具页面布局 (SideMenuPage)
工具页面采用**固定标题 + 可滚动内容**的布局模式：

**页面结构**:
```
┌─────────────────────────────────┐
│  Page Header (固定，不滚动)      │
├─────────────────────────────────┤
│  Page Content (内容滚动)         │
│                                 │
│  内部滚动区域                    │
│  - 滚动条隐藏                    │
│  - 最大高度自适应                │
│                                 │
└─────────────────────────────────┘
```

**滚动容器设计**:
- `.page-content`: 直接作为滚动容器
- `max-height: calc(100vh - 64px - 220px)`: 动态计算最大高度
- 滚动条隐藏，保持视觉简洁:
  ```css
  .page-content {
    overflow-y: auto;
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;       /* IE/Edge */
  }
  .page-content::-webkit-scrollbar {
    display: none;                  /* Chrome/Safari/Opera */
  }
  ```

**响应式间距**:
- 桌面端: `padding: 24px`
- 平板: `padding: 16px`
- 移动端: `padding: 8px`，顶部额外 `60px` 为菜单按钮留空间

#### 内容区域
- 最大宽度: 1200px
- 内边距: 24px
- 背景: 浅灰背景 (#fafafa)

### 功能组件

#### 卡片 (Card)
```css
.card {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--padding-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

#### 按钮 (Button)
- 主按钮: 橙色背景，白色文字
- 次按钮: 白色背景，橙色边框
- 悬停效果: 上浮 2px + 阴影增强
- 圆角: radius-md (8px)

#### 输入框 (Input)
- 高度: 32px (默认) / 40px (large)
- 边框: 1px solid #d9d9d9
- 聚焦: 橙色边框 + 外发光
- 圆角: radius-md (8px)

### 工具组件

#### 工具卡片 (ToolCard)
**列表布局** (当前使用):
- 布局: 横向排列 (flex-direction: row)
- 内边距: 20px
- 圆角: radius-lg (12px)
- 图标区域: 56x56px，无背景色
- 内容区域: 自适应宽度，左侧间距 24px
- 悬停: 上浮 4px + 阴影 + 橙色边框

**网格布局** (备选):
- 高度: 180px
- 垂直居中布局
- 适用于工具较少的场景

#### 工具页面容器
- 最大宽度: 800px
- 背景: 白色
- 圆角: radius-lg (12px)
- 阴影: shadow-sm
- 边框: 1px solid #f0f0f0
- 居中对齐: `margin: 0 auto`

## 📐 间距标准

### 页面级间距
- 页面顶部: 64px (导航栏高度)
- 页面左右: 24px (桌面) / 16px (移动端)
- 区块间距: 48px - 64px

### 组件级间距
- 卡片内边距: 24px
- 元素间距: 16px
- 图标文字间距: 8px

### 文字间距
- 标题与正文: 16px
- 正文段落: 16px
- 列表项: 8px

## 🎬 动画规范

### 入场动画
```css
/* 淡入上滑 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 交互动画
- 悬停: transform + shadow
- 点击: scale(0.98)
- 展开/收起: height + opacity
- 建议时长: 0.2s - 0.3s

## 📱 响应式设计

### 断点策略
- 移动端 (< 768px): 单列布局，紧凑间距，侧边栏浮动收起
- 平板 (768px - 1023px): 双列布局，中等间距
- 桌面 (1024px - 1279px): 三列布局
- 大屏 (≥ 1280px): 四列布局，宽松间距

### 关键响应式行为

#### 侧边栏响应式
```css
/* 移动端: 浮动覆盖模式 */
@media (max-width: 768px) {
  .side-menu {
    position: fixed !important;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 100;
  }

  .side-menu--collapsed {
    left: -240px;  /* 收起时移出屏幕 */
  }
}
```

#### 内容区域滚动高度
```css
/* 桌面端 */
.page-content {
  max-height: calc(100vh - 64px - 220px);
}

/* 平板 */
@media (max-width: 1024px) {
  .page-content {
    max-height: calc(100vh - 64px - 220px);
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .page-content {
    max-height: calc(100vh - 64px - 240px);
  }
}
```

### 适配原则
1. 移动优先，渐进增强
2. 保持核心功能可用
3. 调整字号和间距
4. 简化布局和交互
5. 内容区域优先滚动，标题固定

## ✅ 最佳实践

### 1. 使用设计令牌
```css
/* ✅ 推荐 */
.title {
  color: var(--color-text-title);
  font-size: var(--font-size-h2);
  margin-bottom: var(--spacing-md);
}

/* ❌ 避免 */
.title {
  color: #1a1a1a;
  font-size: 28px;
  margin-bottom: 16px;
}
```

### 2. 保持一致性
- 相同功能使用相同的颜色
- 相同层级使用相同的字号
- 相同组件使用相同的圆角和阴影

### 3. 响应式设计
```css
.component {
  padding: var(--spacing-md);
}

@media (max-width: 768px) {
  .component {
    padding: var(--spacing-sm);
  }
}
```

**媒体查询位置**: 所有组件级媒体查询统一放在 `main.css` 中管理，便于维护。

### 4. 隐藏滚动条
在需要滚动但不想显示滚动条的场景：
```css
.scrollable {
  overflow-y: auto;
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;       /* IE/Edge */
}

.scrollable::-webkit-scrollbar {
  display: none;                  /* Chrome/Safari/Opera */
}
```

### 5. 可访问性
- 确保文字对比度 ≥ 4.5:1
- 提供足够的点击区域 (≥ 44px)
- 支持键盘导航
- 添加适当的 ARIA 标签
- 隐藏滚动条后确保用户仍可滚动（鼠标滚轮、触摸）

### 6. 性能优化
- 避免过度使用阴影和动画
- 使用 CSS 变量减少重复
- 合理使用 transform 和 opacity
- 控制重绘和重排

## 🔧 工具和资源

### 设计令牌文件结构
```
src/styles/
├── tokens/
│   ├── colors.css        # 色彩变量
│   ├── typography.css    # 排版变量
│   ├── spacing.css       # 间距变量
│   ├── effects.css       # 圆角和阴影
│   ├── breakpoints.css   # 响应式断点
│   └── index.css         # 汇总导入
├── base/
│   ├── reset.css         # 样式重置
│   └── global.css        # 全局样式
└── utilities/
    └── helpers.css       # 工具类
```

### 如何使用

#### 1. 导入设计令牌
```typescript
// main.ts
import './assets/main.css'
```

#### 2. 在组件中使用
```vue
<style scoped>
.my-component {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
</style>
```

#### 3. 动态主题
```typescript
// 通过 JavaScript 修改 CSS 变量
document.documentElement.style.setProperty('--color-primary', '#1890ff')
```

## 📚 参考资料

- [Ant Design Vue 设计语言](https://www.antdv.com/docs/vue/introduce/)
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 📝 更新日志

### v1.1.0 (2026-04-16)
- ✨ 新增工具页面布局规范（固定标题 + 可滚动内容）
- ✨ 新增滚动容器设计（隐藏滚动条）
- ✨ 新增响应式侧边栏行为（移动端浮动覆盖）
- ✨ 更新工具卡片布局（列表模式）
- 📝 完善响应式设计最佳实践
- 🎨 统一媒体查询管理到 main.css

### v1.0.0 (2026-04-16)
- ✨ 建立完整的设计令牌系统
- ✨ 定义色彩、排版、间距、圆角、阴影规范
- ✨ 重构布局组件和页面组件
- ✨ 统一视觉语言和交互模式
- 📖 创建设计系统文档

---

**维护者**: XHL Tools Team  
**最后更新**: 2026-04-16
