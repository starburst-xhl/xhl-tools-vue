# 设计令牌速查表

快速查找常用设计令牌。完整定义见 `DESIGN_SYSTEM.md`。

## 颜色

### 主题色
```css
--color-primary: #ff9b17              /* 主色-橙 */
--color-primary-light: #ffb84d        /* 主色浅 */
--color-primary-dark: #e68a00         /* 主色深 */
--color-primary-bg: #fff8f0           /* 主色背景 */
--color-primary-bg-light: #fffbf5     /* 主色极浅背景 */
--color-primary-hover: #ff8c00        /* 主色悬停 */
--color-primary-active: #d97a00       /* 主色激活 */
```

### 文字
```css
--color-text-title: #1a1a1a           /* 标题 */
--color-text-primary: #262626         /* 主要文字 */
--color-text-secondary: #666666       /* 次要文字 */
--color-text-tertiary: #8c8c8c        /* 辅助文字 */
--color-text-disabled: #bfbfbf        /* 禁用 */
```

### 边框 & 背景
```css
--color-border: #d9d9d9               /* 边框 */
--color-border-light: #f0f0f0         /* 浅边框 */
--color-border-lighter: #f5f5f5       /* 极浅边框 */
--color-border-dark: #bfbfbf          /* 深边框 */
--color-bg: #fafafa                   /* 页面背景 / 内容卡片背景 */
--color-bg-component: #ffffff         /* 组件背景（白底） */
--color-bg-hover: #f5f5f5             /* 悬停背景 */
--color-bg-tool-display: rgb(255, 248, 230) /* 工具展示区暖黄背景 — 用于结果/时间/密码等突出显示 */
--color-bg-selected: #fff8f0          /* 已选中背景 */
--color-bg-disabled: #f5f5f5          /* 禁用背景 */
--color-divider: #f0f0f0              /* 分隔线 */
```

### 功能色
```css
--color-success: #52c41a              /* 成功绿 */
--color-warning: #faad14              /* 警告橙 */
--color-error: #ff4d4f                /* 错误红 */
--color-info: #1890ff                 /* 信息蓝 */
```

## 字号

```css
--font-size-display: 48px             /* 超大标题 */
--font-size-h1: 36px                  /* 一级标题 */
--font-size-h2: 28px                  /* 二级标题 */
--font-size-h3: 20px                  /* 三级标题 */
--font-size-h4: 18px                  /* 四级标题 */
--font-size-h5: 16px                  /* 五级标题 / 区块标题 */
--font-size-body: 14px                /* 正文 */
--font-size-body-sm: 13px             /* 小号正文 */
--font-size-caption: 12px             /* 辅助文字 */
--font-size-caption-sm: 11px          /* 极小辅助文字 */
```

## 字重

```css
--font-weight-regular: 400            /* 常规 */
--font-weight-medium: 500             /* 中等 */
--font-weight-semibold: 600           /* 半粗 */
--font-weight-bold: 700               /* 粗体 */
```

## 间距

基于 8px 网格系统:

```css
--spacing-xs: 4px                     /* 超小 */
--spacing-sm: 8px                     /* 小 */
--spacing-md-sm: 12px                 /* 中小 */
--spacing-md: 16px                    /* 中等 */
--spacing-md-lg: 20px                 /* 中大 */
--spacing-lg: 24px                    /* 大 */
--spacing-xl: 32px                    /* 较大 */
--spacing-xxl: 40px                   /* 超大 */
--spacing-xxxl: 48px                  /* 特大 */
--spacing-xxxxl: 64px                 /* 巨大 */
```

**使用场景**:
- `xs`: 图标与文字
- `sm`: 元素内部
- `md`: 组件内边距
- `lg`: 组件外边距
- `xl`+: 区块间距

## 圆角

```css
--radius-sm: 4px                      /* 小按钮、标签 */
--radius-md-sm: 6px                   /* 小组件 */
--radius-md: 8px                      /* 输入框 */
--radius-lg: 12px                     /* 卡片 */
--radius-xl: 16px                     /* 大容器 */
--radius-full: 9999px                 /* 圆形 */
```

## 阴影

> ⚠️ 项目采用扁平化设计，工具页面**不使用阴影**。以下令牌仅用于特殊场景（如 DiceTool 动画效果）。

```css
--color-shadow: rgba(0,0,0,0.08)               /* 基础阴影色 */
--color-shadow-light: rgba(0,0,0,0.04)         /* 浅阴影色 */
--color-shadow-dark: rgba(0,0,0,0.16)          /* 深阴影色 */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08)        /* 卡片 — 日常不使用 */
--shadow-md: 0 4px 16px rgba(0,0,0,0.12)       /* 悬停 — 日常不使用 */
--shadow-lg: 0 8px 24px rgba(0,0,0,0.16)       /* 浮动 — 日常不使用 */
--shadow-xl: 0 12px 32px rgba(0,0,0,0.20)      /* 弹窗 — 日常不使用 */
```

## 动画

### 时长
```css
--duration-fast: 0.15s                /* 快速 */
--duration-normal: 0.3s               /* 常规 */
--duration-slow: 0.5s                 /* 慢速 */
```

### 缓动函数
```css
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1)
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1)
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1)
```

### 过渡
```css
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

## 快速示例

### 内容卡片（扁平化，不用阴影）
```css
.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}
```

### 工具展示区（暖黄背景，突出显示）
```css
.result-display {
  background: var(--color-bg-tool-display);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
}
```

### 标题样式
```css
.title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}
```

## 响应式断点

```css
--breakpoint-mobile: 768px
--breakpoint-tablet: 1024px
--breakpoint-desktop: 1280px
--breakpoint-wide: 1440px
```
