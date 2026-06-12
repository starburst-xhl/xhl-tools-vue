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
<!-- ChatTool/ 和 StringTool/ 为空分类，暂不使用 -->

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

**四种工具类型**:
- **输入处理型**：用户输入 → 点击按钮 → 显示结果（参考 `references/ToolTemplate.vue`）
- **文件处理型**：上传文件 → 自动处理 → 显示结果（参考 `references/file-upload-pattern.md`）
- **实时生成型**：配置参数 → 自动生成结果（watch 驱动，无需点击按钮）
- **计时器/状态机型**：启停控制 + 状态切换 + 记录列表

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
- 结果区域用 content-card 包裹（浅灰底 + 浅边框 + 圆角）
- 复制功能使用项目封装的 `copyToClipboard` 函数（带 SSR 守卫 + fallback），不要裸用 `navigator.clipboard`
- **catch 语句**：不使用未使用的变量 → `catch {}` 而非 `catch (error) {}`

### 复制功能规范

使用项目封装的 `copyToClipboard` 工具函数，**不要裸用 `navigator.clipboard.writeText()`**。

```typescript
// ✅ 推荐：使用封装函数（有 SSR 守卫 + fallback）
import { copyToClipboard } from "@/utils/clipboard_utils";
await copyToClipboard(text, '复制成功', '复制失败');

// ❌ 避免：裸用 navigator.clipboard（SSG 环境下会报错）
await navigator.clipboard.writeText(text);
```

`copyToClipboard` 的优势：
- SSG 环境安全（自动检测 `navigator.clipboard` 是否可用）
- 自动 fallback 到 `document.execCommand('copy')`
- 统一的成功/失败提示

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

/* ✅ 正确：子区块用 content-card */
.content-card {
  background: var(--color-bg);          /* 浅灰底，与白底外层形成对比 */
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

### 统一样式规范：小标题与内容卡片

所有工具页面必须使用统一的 `section-label`、`section-title` 和 `content-card` 样式，确保视觉一致性。

#### 两种标题级别

| 类型 | Class | 场景 | 字号 | 字重 | 颜色 | 间距 |
|------|-------|------|------|------|------|------|
| **区段标签** | `section-label` | 标记输入框、输出框等小区域 | `var(--font-size-body)` 14px | `var(--font-weight-semibold)` 600 | `var(--color-text-title)` | `margin-bottom: var(--spacing-sm)` |
| **区块标题** | `section-title` | 内容卡片内的区块头部 | `var(--font-size-h5)` 16px | `var(--font-weight-semibold)` 600 | `var(--color-text-title)` | `margin-bottom: var(--spacing-md)` |

**CSS 定义**:
```css
/* 区段标签 — 标记输入/输出区域 */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

/* 区块标题 — 内容卡片的头部 */
.section-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}
```

#### 内容卡片

内容卡片用于将相关内容分组为视觉区块。**不要给根元素加卡片样式**（外层 `.page-content` 已是卡片容器）。

| 属性 | 值 | 说明 |
|------|------|------|
| `background` | `var(--color-bg)` | 浅灰底(#fafafa)，与白底页面形成对比 |
| `padding` | `var(--spacing-lg)` | 24px 内边距 |
| `border-radius` | `var(--radius-lg)` | 12px 圆角 |
| `border` | `1px solid var(--color-border-light)` | 浅色边框 |

**CSS 定义**:
```css
/* 内容卡片 — 子区块容器 */
.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}
```

#### 标准页面结构

```vue
<template>
  <div class="my-tool">
    <!-- 简单工具：平铺布局 + ToolTips -->
    <div class="tool-content">
      <div>
        <label class="section-label">原始文本</label>
        <a-textarea v-model:value="inputText" :rows="4" />
      </div>

      <div class="button-container">
        <a-button type="primary">编码</a-button>
        <a-button type="primary">解码</a-button>
      </div>

      <div>
        <label class="section-label">编码结果</label>
        <a-textarea v-model:value="outputText" :rows="4" />
      </div>

      <ToolTips :tips="[...]" />
    </div>

    <!-- 复合工具：分区卡片 + section-title -->
    <div class="tool-content">
      <div class="content-card">
        <div class="section-title">配置选项</div>
        <!-- 配置表单 -->
      </div>

      <div class="content-card">
        <div class="section-title">生成结果</div>
        <!-- 结果展示 -->
      </div>

      <ToolTips :tips="[...]" />
    </div>
  </div>
</template>

<style scoped>
.my-tool {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* 区段标签、区块标题、内容卡片 — 复制以上统一定义 */
.section-label { ... }
.section-title { ... }
.content-card { ... }
</style>
```

**⚠️ 注意事项**:
- **结构性样式**（section-label、section-title、content-card 等）统一用短命名，不要加工具名前缀
- **工具特有样式**（如颜色预览区、字段列表项等）用 BEM 命名（`tool-name__element`）
- 每个 `<style scoped>` 中需要复制统一定义（因为 scoped 样式不共享）
- 区段标签用 `<label>` 元素（语义化），区块标题用 `<div>` 元素
- 结果卡片的头部如果有右侧操作按钮，用 flex 布局：
  ```css
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }
  ```

### 扁平化设计规范

**✅ 推荐：扁平化风格**
```css
.content-card {
  background: var(--color-bg);
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
<a-card>  /* ❌ 用普通 div + content-card */
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

## 工具类型开发指南

### 实时生成型工具

特征：配置参数变化时自动重新生成结果，无需手动点击按钮。

**核心模式：`watch` + `onMounted` 驱动自动生成**

```vue
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue";

const config = reactive({ length: 12, uppercase: true, lowercase: true });
const result = ref("");

const generate = () => {
  // 根据配置生成结果
  result.value = "生成的数据...";
};

// 配置变化时自动重新生成
watch(config, () => { generate(); }, { deep: true });

// 初始化时生成一次
onMounted(() => { generate(); });
</script>
```

**关键模式**:
- `reactive` 用于配置对象（多字段联动），`ref` 用于简单参数
- `watch` 的 `{ deep: true }` 监听配置对象的深层变化
- `onMounted` 初始化生成，避免空白结果页
- 保留一个"重新生成"按钮供用户手动刷新

**动态字段增删**（MockDataGenerator 等工具特有）:
```vue
<script setup lang="ts">
import { reactive } from "vue";

interface Field { id: string; name: string; type: string; enabled: boolean; }
const fields = reactive<Field[]>([]);

const addField = (type: string) => {
  fields.push({ id: Date.now().toString(36), name: type, type, enabled: true });
};

const removeField = (id: string) => {
  const index = fields.findIndex(f => f.id === id);
  if (index > -1) fields.splice(index, 1);
};
</script>
```

**结果展示区域** — 使用 `--color-bg-tool-display`（暖黄底）令牌，突出展示区:
```css
.result-display {
  background: var(--color-bg-tool-display);  /* rgb(255, 248, 230) 暖黄色 */
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
}
```

**已有参考**: `PasswordGenerator.vue`、`MockDataGenerator.vue`、`ColorPickerTool.vue`

### 计时器/状态机型工具

特征：启停控制 + 状态切换 + 记录列表。

**核心模式：setInterval + 状态控制 + onUnmounted 清理**

```vue
<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

const isRunning = ref(false);
const elapsedTime = ref(0);
let timerId: number | null = null;

const start = () => {
  timerId = window.setInterval(() => {
    elapsedTime.value = Date.now() - startTime;
  }, 10);
  isRunning.value = true;
};

const stop = () => {
  if (timerId !== null) { clearInterval(timerId); timerId = null; }
  isRunning.value = false;
};

// ⚠️ 必须在组件销毁时清理定时器，防止内存泄漏
onUnmounted(() => {
  if (timerId !== null) clearInterval(timerId);
});
</script>
```

**关键要点**:
- `setInterval` 必须在 `onUnmounted` 中清理，防止内存泄漏
- `isRunning` / `isRolling` 状态控制按钮的显示/隐藏和禁用
- 记录列表使用 `ref<Array<{ time: number; display: string }>>` 存储
- 记录展示时使用 `.slice().reverse()` 倒序显示最新记录

**时间显示区** — 使用 `--color-bg-tool-display` + 大号等宽字体:
```css
.time-display {
  background: var(--color-bg-tool-display);
  padding: 32px;
  border-radius: var(--radius-lg);
  text-align: center;
}
.time-text {
  font-size: 48px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: var(--color-primary);
}
@media (max-width: 768px) {
  .time-text { font-size: 36px; }
}
@media (max-width: 480px) {
  .time-text { font-size: 28px; }
}
```

**已有参考**: `StopwatchTool.vue`、`DiceTool.vue`

### 文件下载功能

单文件下载 — 创建临时 `<a>` 元素触发下载:
```typescript
const download = () => {
  const a = document.createElement('a');
  a.download = 'filename.png';
  a.href = dataUrl; // 图片的 data URL 或 Blob URL
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

批量打包下载 — 使用 JSZip:
```typescript
import JSZip from 'jszip';

const downloadAll = async () => {
  const zip = new JSZip();
  files.forEach(f => zip.file(f.name, f.data));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'output.zip';
  a.href = url;
  a.click();
  URL.revokeObjectURL(url); // ⚠️ 释放 ObjectURL
};
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
- CSS类名: **双轨命名** — 结构性样式用短命名，工具特有样式用 BEM
- 路由 path: kebab-case (`stopwatch-tool`)
- 路由 name: 自动从 path 生成 (`StopwatchTool`)

**双轨命名规则**:
- **结构性样式**（跨工具通用）用短命名：`section-label`、`section-title`、`content-card`、`button-container`、`card-header`
- **工具特有样式**（仅当前工具使用）用 BEM：`color-picker__preview`、`mock-generator__field`、`timer-tool__lap-item`
- 判断标准：如果这个样式在 3+ 个工具中都会出现 → 短命名；只在当前工具出现 → BEM

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