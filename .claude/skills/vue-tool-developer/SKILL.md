---
name: vue-tool-developer
description: 开发XHL Tools工具箱的新工具。当用户要添加新工具、创建工具页面、扩展工具分类、或提到"开发工具"、"添加功能"、"新建工具"时使用。特别关注SSG架构限制、设计令牌系统和美观的UI实现。
---

# Vue 工具开发者指南

在 xhl-tools-vue 项目中添加新工具。项目采用 Vue 3 + TypeScript + Vite SSG 架构。

## 快速开发流程

### 1. 确定工具分类

**现有分类** (`src/views/Tools/`):
- `CodecTool/` - 编解码工具
- `AesTool/` - 加密工具  
- `NumberTool/` - 数字工具
- `MediaTool/` - 媒体工具
- `ChatTool/` - 聊天工具

### 2. 创建组件文件

在对应分类目录下创建 `YourToolName.vue`。

**⚠️ SSG 架构注意事项**:
- 组件必须兼容服务端渲染(SSR)
- 不要在 `<script setup>` 顶层使用 `window`/`document`
- 浏览器 API 放在 `onMounted` 钩子中
- 确保组件在 Node.js 环境下可运行

### 3. 注册路由

在 `src/router/index.ts` 的对应分类路由中添加:

```typescript
{
  path: 'your-tool-name',
  name: 'YourToolName',
  component: () => import('@/views/Tools/{CategoryTool}/YourToolName.vue'),
  meta: {
    title: '工具名称',
    icon: 'ToolOutlined',
    description: '工具描述'
  }
}
```

### 4. 添加图标(如需)

在 `src/utils/tool_utils.ts` 的 `iconMap` 中添加新图标导入。

## 设计规范速查

### 使用设计令牌

**✅ 推荐做法**:
```css
.my-component {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}
```

**❌ 避免硬编码**:
```css
/* 不要这样做 */
.my-component {
  color: #262626;
  padding: 16px;
}
```

**关键设计令牌**:
- 主色: `--color-primary` (#ff9b17)
- 文字: `--color-text-primary/secondary/tertiary`
- 间距: `--spacing-xs` 到 `--spacing-xxxxl` (4px-64px)
- 圆角: `--radius-sm` 到 `--radius-xxl` (4px-20px)
- 阴影: `--shadow-sm/md/lg/xl`

### 布局最佳实践

- 容器使用 `max-width: 400px-600px`
- 使用 Flexbox 布局
- 按钮组使用 `gap` 间距
- 结果区域用 `a-card` 包裹
- 复制功能使用 `navigator.clipboard.writeText()`

### 交互规范

- 使用 `message` 提供操作反馈
- 加载状态使用 `:loading` 属性
- 空输入使用 `message.warning()` 提示
- 成功/失败都要有明确反馈

## 组件模板

使用 `references/ToolTemplate.vue` 作为起点,或参考以下优秀实现:

**推荐参考**:
- `StopwatchTool.vue` - 时间显示、记录列表、主题色应用
- `ColorPickerTool.vue` - 大尺寸预览、多格式展示、交互反馈

## 命名规范

- 文件名: PascalCase (`StopwatchTool.vue`)
- CSS类名: BEM (`tool-name__element--modifier`)
- 路由 path: kebab-case (`stopwatch-tool`)
- 路由 name: PascalCase (`StopwatchTool`)

## 测试验证

```bash
npm run dev
```

检查项:
- ✅ 路由正常访问
- ✅ 功能正常工作
- ✅ UI符合设计规范
- ✅ 侧边菜单显示正确
- ✅ 工具首页卡片可见
- ✅ 搜索功能可用

## 参考资源

- **设计系统**: `DESIGN_SYSTEM.md` - 完整设计规范
- **项目架构**: `CODEBUDDY.md` - SSG架构、路由配置
- **模板文件**: `references/ToolTemplate.vue` - 基础模板
