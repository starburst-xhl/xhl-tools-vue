---
name: vue-tool-developer
description: 开发XHL Tools工具箱的新工具。当用户要添加新工具、创建工具页面、扩展工具分类、或提到"开发工具"、"添加功能"、"新建工具"、"二维码"、"编解码"、"解析"等工具类需求时使用。也包括使用ToolTips组件为工具填充页面正文内容的场景。特别关注SSG架构限制、设计令牌系统、布局容器约束和美观的UI实现。
---

# Vue 工具开发者指南

在 xhl-tools-vue 项目中添加新工具。项目采用 Vue 3 + TypeScript + Vite SSG 架构。

## 快速开发流程

### 1. 确定工具分类

**现有分类** (`src/views/Tools/`):
- `CodecTool/` - 编解码工具(Base64/二维码/AES/JSON/二维码解析)
- `NumberTool/` - 数字工具(秒表/密码生成器/骰子)
- `MediaTool/` - 媒体工具(RPGMVP转换/颜色拾取)
- `MockTool/` - Mock工具
- `ChatTool/` - 聗天工具
- `StringTool/` - 字符串工具

### 2. 安装依赖（如需）

如果工具需要第三方 npm 包：

1. 使用 `fnm use 22 && npm install <package>` 安装
2. **必须检查 SSG 兼容性** — 如果包在 Node.js 环境下使用 `window`/`document` 等浏览器 API，需将其添加到 `vite.config.ts` 的 `ssr.noExternal` 数组中：

```typescript
// vite.config.ts
ssr: {
  noExternal: ['ant-design-vue', '@ant-design/icons-vue', '@ant-design/icons-svg', 'crypto-js', 'jsqr'], // ← 新增包名
}
```

> 当前 `ssr.noExternal` 列表：`ant-design-vue`, `@ant-design/icons-vue`, `@ant-design/icons-svg`, `crypto-js`, `jsqr`

### 3. 创建组件文件

在对应分类目录下创建 `YourToolName.vue`。

**⚠️ SSG 架构注意事项**:
- 组件必须兼容服务端渲染(SSR)
- 不要在 `<script setup>` 顶层使用 `window`/`document`
- 浏览器 API 放在 `onMounted` 钩子中
- 确保组件在 Node.js 环境下可运行

**⚠️ 布局容器约束**:
- 工具组件在 `SideMenuPage.vue` 的 `.page-content` 卡片内渲染
- `.page-content` 已提供：白底(`var(--color-bg-component)`)、圆角、边框、内边距、`max-width: 800px`
- **组件根元素必须 `width: 100%`，不要设置 `max-width`**
- **不要在组件根元素再加卡片容器**（背景、边框、圆角）——避免卡片嵌套
- 只有结果区域等子区块需要卡片包裹

**两种工具类型**:
- **输入处理型**：用户输入 → 点击按钮 → 显示结果（参考 `references/ToolTemplate.vue`）
- **文件处理型**：上传文件 → 自动处理 → 显示结果（参考 `references/file-upload-pattern.md`）

### 4. 配置路由（只需一处）

**⚠️ 路由文件 `src/router/index.ts` 由脚本自动生成，不要手动修改！**

只需在 **`src/constants/tool-routes.json`** 中添加配置，路由会自动同步到 `router/index.ts`。

在对应分类的 `children` 数组中添加：

```json
{
  "path": "your-tool-name",
  "component": "@/views/Tools/CodecTool/YourToolName.vue",
  "meta": {
    "icon": "ScanOutlined",
    "title": "工具名称",
    "description": "用户操作说明，用于页面标题区展示",
    "seoDescription": "搜索引擎描述，100-150字符，包含关键词和核心功能"
  }
}
```

> **seoDescription 字节数规则**：100-150字符，汉字占2字节。脚本会校验长度并发出警告。

### 5. 添加图标（如需）

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
  transition: var(--transition-fast);
}
```

**❌ 避免硬编码**:
```css
.my-component {
  color: #262626;   /* 不要硬编码 */
  padding: 16px;    /* 不要硬编码 */
}
```

**关键设计令牌**:
- 主色: `--color-primary` (#ff9b17)
- 文字: `--color-text-primary/secondary/tertiary`
- 背景: `--color-bg-component` (白底) / `--color-bg` (#fafafa)
- 间距: `--spacing-xs` 到 `--spacing-xxxxl` (4px-64px)
- 圆角: `--radius-sm` 到 `--radius-xxl` (4px-20px)

### 布局最佳实践

- **组件根元素 `width: 100%`**（外层 `.page-content` 已限制 `max-width: 800px`）
- 使用 Flexbox 布局，`gap` 控制间距
- **按钮默认大小**（不指定 size）
- **按钮方形**（不使用 `shape="circle"` 或 `shape="round"`）
- **辅助操作按钮**：`type="link" size="small"`（如复制、移除）
- 结果区域用卡片 div 包裹（白底 + 浅边框 + 圆角）
- 复制功能使用 `navigator.clipboard.writeText()`
- **catch 语句**：不使用未使用的变量 → `catch {}` 而非 `catch (error) {}`

### ⚠️ 卡片嵌套警告

外层 `.page-content` 已是卡片容器（白底 + 边框 + 圆角）。工具组件内部：
- **不要给根元素加背景/边框/圆框** — 会造成双层卡片
- **只有子区块**（如结果区）才用卡片包裹

```css
/* ✅ 正确：根元素只是容器 */
.tool-root {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ❌ 错误：给根元素加卡片样式 */
.tool-root {
  width: 100%;
  background: var(--color-bg-component); /* ← 外层已有，不要重复 */
  border-radius: var(--radius-lg);       /* ← 外层已有 */
  border: 1px solid var(--color-border-light); /* ← 外层已有 */
  padding: var(--spacing-xl);           /* ← 外层已有 */
}

/* ✅ 正确：子区块用卡片 */
.result-card {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-light);
}
```

### 按钮规范

**✅ 推荐**：
```vue
<!-- 默认大小 + 方形 -->
<a-button type="primary">格式化</a-button>
<a-button>重置</a-button>

<!-- 辅助操作 -->
<a-button type="link" size="small" @click="copyResult">复制</a-button>
```

**❌ 避免**：
```vue
<a-button shape="circle">❌ 圆形按钮</a-button>
<a-button shape="round">❌ 圆角按钮</a-button>
<a-button size="large">❌ 大号按钮</a-button>
```

### 扁平化设计规范

**✅ 推荐：扁平化风格**
```css
.result-section {
  background: var(--color-bg-component);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}
```

**❌ 避免：阴影和 Card 组件**
```css
.result-section {
  box-shadow: var(--shadow-sm);  /* ❌ 不用阴影 */
}
<a-card>  /* ❌ 用普通 div */
```

### 使用 ToolTips 填充页面内容

对于用户操作直观、无需额外说明的工具，使用 `ToolTips` 组件提供精简的要点提示，既能填充页面正文区域（对 SEO 有益），又保持界面紧凑统一。

**组件路径**: `src/components/ToolTips.vue`

```vue
<script setup lang="ts">
import ToolTips from "@/components/ToolTips.vue";
</script>

<template>
  <div class="my-tool">
    <!-- 工具操作区... -->

    <ToolTips :tips="[
      '支持中文、日文、韩文等各种 Unicode 字符',
      '编码或解码成功后结果自动复制到剪贴板',
      '所有处理在浏览器本地完成，数据不会上传到服务器',
    ]" />
  </div>
</template>
```

**使用原则**:
- 每条 tips 控制在 15-25 字，一句话讲清楚
- 3-5 条为佳，不要超过 6 条
- 内容聚焦于：功能特性、使用便利性、隐私安全承诺
- 不要放"使用说明"类的步骤描述（如"先输入文本再点击按钮"）— 这些已由路由 meta 的 description 字段在页面标题区展示
- ToolTips 应放在工具操作区的底部，作为结尾的自然收束

**适用场景**: 所有工具都可以使用 Tips，尤其适合操作路径短、界面简洁的工具（如编解码、格式化等），可以帮助填充页面正文，改善 SEO。

### 交互规范

#### Message 提示规范

使用 Ant Design Vue 的 `message` 组件：

```typescript
import { message } from "ant-design-vue";
message.success("格式化成功");
message.error("JSON格式不正确");
message.warning("请输入JSON内容");
```

文案原则：简洁明确，具体描述，避免笼统。

#### 按钮状态

```vue
<a-button :loading="isLoading">处理</a-button>
<a-button :disabled="!isValid">提交</a-button>
```

## 组件模板

使用 `references/ToolTemplate.vue` 作为输入处理型工具的起点。

**推荐参考**:
- `ToolTips.vue` - 可复用的 tips 组件，所有工具都建议使用
- `StopwatchTool.vue` - 时间显示、记录列表
- `ColorPickerTool.vue` - 大尺寸预览、多格式展示
- `Base64Tool.vue` / `UrlCodeTool.vue` - 带 ToolTips 的编解码操作示例

**文件上传型工具**参考 `references/file-upload-pattern.md`。

## 命名规范

- 文件名: PascalCase (`StopwatchTool.vue`)
- CSS类名: BEM (`tool-name__element--modifier`)
- 路由 path: kebab-case (`stopwatch-tool`)
- 路由 name: 自动从 path 生成 (`StopwatchTool`)

## 测试验证

```bash
fnm use 22
npm run dev
```

检查项:
- ✅ 路由正常访问（侧边菜单自动显示）
- ✅ 功能正常工作
- ✅ UI符合设计规范（无卡片嵌套）
- ✅ 搜索功能可用

构建验证:
```bash
fnm use 22
npm run type-check   # 类型检查
npm run build-only   # SSG构建（路由自动生成）
```

## 参考资源

- **设计系统**: `DESIGN_SYSTEM.md` - 完整设计规范
- **项目架构**: `CODEBUDDY.md` - SSG架构、路由配置
- **模板文件**: `references/ToolTemplate.vue` - 输入处理型工具模板
- **文件上传**: `references/file-upload-pattern.md` - 文件处理型工具模式
- **SSG指南**: `references/ssg-guide.md` - SSR兼容性详细说明
- **设计令牌**: `references/design-tokens.md` - 设计令牌速查表
- **交互规范**: `references/interaction-guide.md` - Message/按钮状态规范