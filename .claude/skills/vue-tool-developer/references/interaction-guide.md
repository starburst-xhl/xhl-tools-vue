# 交互设计快速指南

## Message 提示组件

### 基础用法

```typescript
import { message } from "ant-design-vue";

// 成功
message.success("格式化成功");

// 错误
message.error("JSON格式不正确");

// 警告
message.warning("请输入JSON内容");

// 信息（少用）
message.info("提示信息");
```

### 类型选择指南

| 类型 | 使用场景 | 典型文案 |
|------|---------|---------|
| **success** | 操作成功完成 | "格式化成功"、"已复制到剪贴板"、"保存成功" |
| **error** | 操作失败 | "JSON格式不正确"、"网络连接失败"、"解析错误" |
| **warning** | 输入问题 | "请输入内容"、"请选择文件"、"参数缺失" |
| **info** | 信息提示 | 极少使用 |

### 文案规范

**✅ 好的文案**：
- 具体：`"JSON格式不正确"` 而非 `"格式错误"`
- 明确：`"已复制到剪贴板"` 而非 `"操作成功"`
- 简洁：`"请输入内容"` 而非 `"您输入的内容为空，请重新输入"`

**❌ 不好的文案**：
- `"操作成功"` - 太笼统
- `"错误"` - 没有信息量
- `"失败"` - 没有说明原因
- `"有问题"` - 不够具体

### 常见场景示例

#### 格式化/转换工具
```typescript
try {
  const result = JSON.parse(input);
  message.success("格式化成功");
} catch (error) {
  message.error("JSON格式不正确");
}

if (!input.trim()) {
  message.warning("请输入JSON内容");
}
```

#### 复制操作
```typescript
try {
  await navigator.clipboard.writeText(text);
  message.success("已复制到剪贴板");
} catch (error) {
  message.error("复制失败");
}
```

#### 文件操作
```typescript
if (!file) {
  message.warning("请选择文件");
  return;
}

try {
  await processFile(file);
  message.success("文件处理成功");
} catch (error) {
  message.error("文件处理失败");
}
```

## 按钮状态

### 加载状态

**使用场景**：异步操作（API调用、文件处理、格式转换等）

```vue
<template>
  <a-button :loading="isLoading" @click="handleProcess">
    处理
  </a-button>
</template>

<script setup>
const isLoading = ref(false);

const handleProcess = async () => {
  isLoading.value = true;
  try {
    await processData();
    message.success("处理完成");
  } finally {
    isLoading.value = false;
  }
};
</script>
```

**效果**：
- 按钮显示加载动画
- 禁用点击，防止重复提交
- 提供明确的操作状态

### 禁用状态

**使用场景**：表单验证、条件判断

```vue
<template>
  <a-button :disabled="!isValid" @click="handleSubmit">
    提交
  </a-button>
</template>

<script setup>
const isValid = computed(() => {
  return inputValue.value.trim().length > 0;
});
</script>
```

**效果**：
- 按钮灰显，不可点击
- 提示用户输入或操作不满足条件
- 配合其他视觉提示使用

## 悬停反馈

### 按钮悬停

```css
.button:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}
```

### 工具卡片悬停（工具列表页）

```css
.tool-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  /* 注意：不使用阴影，保持扁平化 */
}
```

**使用场景**：仅用于工具列表页的工具卡片

### 结果区域悬停（工具页面内）

```css
.result-section:hover {
  border-color: var(--color-primary);
}
```

**使用场景**：工具页面内的结果展示区域，无 transform 和阴影

## 完整交互示例

```vue
<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

const inputValue = ref<string>("");
const result = ref<string>("");
const isLoading = ref<boolean>(false);

const processInput = async () => {
  // 验证输入
  if (!inputValue.value.trim()) {
    message.warning("请输入内容");
    return;
  }

  isLoading.value = true;
  try {
    // 处理逻辑
    await new Promise(resolve => setTimeout(resolve, 500));
    result.value = `处理结果: ${inputValue.value}`;
    message.success("处理完成");
  } catch (error) {
    message.error("处理失败");
  } finally {
    isLoading.value = false;
  }
};

const copyResult = async () => {
  if (!result.value) {
    message.warning("没有可复制的内容");
    return;
  }

  try {
    await navigator.clipboard.writeText(result.value);
    message.success("已复制到剪贴板");
  } catch (error) {
    message.error("复制失败");
  }
};
</script>

<template>
  <div class="tool">
    <a-input v-model:value="inputValue" placeholder="请输入内容" />
    
    <div class="actions">
      <a-button type="primary" :loading="isLoading" @click="processInput">
        处理
      </a-button>
    </div>

    <div v-if="result" class="result">
      <div class="result-header">
        <span>处理结果</span>
        <a-button type="link" size="small" @click="copyResult">
          复制
        </a-button>
      </div>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>
```

## 最佳实践清单

- ✅ 所有成功操作都有提示
- ✅ 错误提示具体说明原因
- ✅ 空输入使用 `warning` 而非 `error`
- ✅ 异步操作使用加载状态
- ✅ 表单验证使用禁用状态
- ✅ 悬停状态提供视觉反馈
- ✅ 文案简洁明确
- ❌ 避免过度提示
- ❌ 避免笼统的提示文案
- ❌ 避免缺少必要的反馈
