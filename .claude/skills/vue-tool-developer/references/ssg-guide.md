# SSG 架构开发指南

xhl-tools-vue 使用 Vite SSG (Static Site Generation) 架构。工具开发必须遵循 SSR 兼容性原则。

## 什么是 SSG?

SSG 在构建时预渲染所有路由为静态 HTML,提升性能和 SEO。构建过程在 Node.js 环境执行,没有浏览器 API。

## 关键限制

### ❌ 避免在顶层使用浏览器 API

```vue
<script setup>
// ❌ 错误: 构建时会报错
const width = window.innerWidth;
const element = document.getElementById('app');

// ❌ 错误: localStorage 不存在
const saved = localStorage.getItem('key');

// ❌ 错误: navigator 在服务端不可用
const clipboard = navigator.clipboard;
</script>
```

### ✅ 正确做法: 使用生命周期钩子

```vue
<script setup>
import { ref, onMounted } from 'vue';

const width = ref(0);

onMounted(() => {
  // ✅ 正确: 只在客户端执行
  width.value = window.innerWidth;
  
  // ✅ 正确: 浏览器 API 在 onMounted 中可用
  const saved = localStorage.getItem('key');
});
</script>
```

## 常见模式

### 1. 使用浏览器特性

```vue
<script setup>
import { ref, onMounted } from 'vue';

const clipboardSupported = ref(false);

onMounted(() => {
  clipboardSupported.value = !!navigator.clipboard;
});

const copyToClipboard = async (text: string) => {
  if (!clipboardSupported.value) {
    message.warning('浏览器不支持剪贴板');
    return;
  }
  await navigator.clipboard.writeText(text);
};
</script>
```

### 2. 使用第三方库

某些库使用浏览器 API,需要确保兼容性:

```typescript
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: [
      'ant-design-vue',
      '@ant-design/icons-vue',
      // 如果新库导致构建失败,添加到这里
    ]
  }
})
```

### 3. 访问 DOM 元素

```vue
<script setup>
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement>();

onMounted(() => {
  // ✅ 正确: 在 mounted 后访问
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 4. 使用 Canvas/WebGL

```vue
<script setup>
import { ref, onMounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement>();

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  // 绘制逻辑...
});
</script>

<template>
  <canvas ref="canvasRef" />
</template>
```

## 路由配置

路由在 SSG 构建时预渲染,所以:

1. **使用动态导入**:
```typescript
component: () => import('@/views/Tools/MyTool.vue')
```

2. **不要动态生成路由**:
```typescript
// ❌ 避免: 构建时无法确定路由
const routes = generateRoutesFromAPI();

// ✅ 正确: 静态定义路由
const routes = [
  { path: 'tool-a', component: () => import('./ToolA.vue') },
  { path: 'tool-b', component: () => import('./ToolB.vue') }
];
```

## 调试 SSG 问题

### 构建失败

如果遇到 `window is not defined` 或类似错误:

1. 检查是否有浏览器 API 在顶层使用
2. 移到 `onMounted` 或 `onBeforeMount` 中
3. 如果是第三方库,添加到 `ssr.noExternal`

### Hydration 不匹配

服务端和客户端渲染不一致:

```vue
<script setup>
import { ref, onMounted } from 'vue';

// ❌ 可能导致不匹配
const time = new Date().toLocaleString();

// ✅ 正确: 只在客户端更新
const time = ref('');
onMounted(() => {
  time.value = new Date().toLocaleString();
});
</script>
```

## 测试 SSG 兼容性

```bash
# 构建测试
npm run build

# 检查构建输出
ls dist/
```

构建成功表示组件兼容 SSG。如果失败,根据错误信息调整代码。
