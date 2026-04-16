---
name: vue-tool-developer
description: 为xhl-tools-vue项目开发新工具的完整流程指导，注重美观的UI设计和良好的用户体验。当用户要添加新工具、创建新的工具页面或扩展现有的工具分类时使用此skill。
---

# Vue 工具开发者指南

此skill帮助你在xhl-tools-vue项目中添加新工具，重点关注美观的UI设计和优秀的用户体验。

## 工具开发流程

### 1. 确定工具分类

首先确定新工具属于哪个现有分类，或是否需要创建新分类：

**现有分类：**
- `codec-tool` - 编解码工具（Base64、二维码等）
- `aes-tool` - 加密工具（AES加解密）
- `number-tool` - 数字工具（秒表、密码生成器等）
- `media-tool` - 媒体工具（图片转换、颜色选择器等）
- `chat-tool` - 聊天工具（待扩展）

### 2. 创建Vue组件

在 `src/views/Tools/{CategoryTool}/` 目录下创建新的Vue组件文件。

#### 设计原则

**视觉设计要点：**
- 使用项目主题色 `#ff9b17`（橙色）作为主色调
- 合理使用间距，主要元素间距为16px、24px、32px
- 使用圆角 `8px` 或 `6px` 让界面更柔和
- 适当使用阴影增加层次感
- 背景色可以使用浅色系如 `rgb(255, 248, 230)` 或 `#fafafa`

**布局建议：**
- 容器使用 `max-width` 限制最大宽度（如400px-600px）
- 使用 `flex` 布局进行对齐和排列
- 重要内容居中显示
- 操作按钮分组排列

**交互体验：**
- 使用Ant Design Vue的message组件提供操作反馈
- 按钮状态变化要有视觉反馈
- 加载状态要有提示
- 复制成功/失败要有明确提示

#### 美观的组件模板

```vue
<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

// 状态定义
const inputValue = ref<string>("");
const result = ref<string>("");
const isLoading = ref<boolean>(false);

// 核心功能函数
const processInput = async () => {
  if (!inputValue.value) {
    message.warning("请输入内容");
    return;
  }

  isLoading.value = true;
  try {
    // 实现工具的核心逻辑
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟异步
    result.value = `处理结果: ${inputValue.value}`;
    message.success("处理完成");
  } catch (error) {
    message.error("处理失败");
  } finally {
    isLoading.value = false;
  }
};

// 重置函数
const resetForm = () => {
  inputValue.value = "";
  result.value = "";
};

// 复制函数
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    message.success("已复制到剪贴板");
  } catch (error) {
    message.error("复制失败");
  }
};
</script>

<template>
  <div class="your-tool__container">
    <!-- 主要内容区域 -->
    <div class="your-tool__main-section">
      <a-input
        v-model:value="inputValue"
        placeholder="请输入内容"
        class="your-tool__input"
        size="large"
        @pressEnter="processInput"
      />
    </div>

    <!-- 按钮区域 -->
    <div class="your-tool__button-group">
      <a-button
        type="primary"
        size="large"
        @click="processInput"
        :loading="isLoading"
      >
        处理
      </a-button>
      <a-button size="large" @click="resetForm">
        重置
      </a-button>
    </div>

    <!-- 结果展示区域 -->
    <div v-if="result" class="your-tool__result-section">
      <a-card class="your-tool__result-card">
        <template #title>
          <div class="your-tool__result-title">
            <span>处理结果</span>
            <a-button type="link" size="small" @click="copyResult">
              复制
            </a-button>
          </div>
        </template>
        <p class="your-tool__result-text">{{ result }}</p>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.your-tool__container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;
}

.your-tool__main-section {
  width: 100%;
}

.your-tool__input {
  width: 100%;
}

.your-tool__button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.your-tool__result-section {
  margin-top: 8px;
}

.your-tool__result-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.your-tool__result-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #262626;
}

.your-tool__result-text {
  margin: 0;
  font-size: 15px;
  color: #595959;
  line-height: 1.6;
}

/* 使用全局动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

#### 优秀参考实现

学习这些美观的工具实现：

- **StopwatchTool** (`src/views/Tools/NumberTool/StopwatchTool.vue`)
  - 使用了主题色 `#ff9b17`
  - 精美的时间显示容器，使用浅橙色背景 `rgb(255, 248, 230)`
  - 等宽字体展示时间，更专业
  - 记录列表使用卡片式设计
  - 良好的间距和视觉层次

- **ColorPickerTool** (`src/views/Tools/MediaTool/ColorPickerTool.vue`)
  - 大尺寸颜色预览，视觉冲击力强
  - 多种颜色格式整齐排列
  - 按钮组布局美观
  - 交互反馈清晰

### 3. 注册路由

在 `src/router/index.ts` 中添加路由配置：

**对于现有分类中的新工具：**
```typescript
{
  path: 'your-tool-name',
  name: 'YourToolName',
  component: () => import('@/views/Tools/{CategoryTool}/YourToolName.vue'),
  meta: {
    title: '工具名称',
    icon: 'IconNameOutlined',
    description: '工具描述文字'
  }
}
```

**如果需要添加来源标注（可选）：**
```typescript
meta: {
  title: '工具名称',
  icon: 'IconNameOutlined',
  description: '工具描述文字',
  source: {
    name: '项目名',
    url: 'https://github.com/...'
  }
}
```

### 4. 添加图标（如需要）

如果使用新的Ant Design Vue图标，在 `src/utils/tool_utils.ts` 中添加：

```typescript
import { YourIconOutlined } from '@ant-design/icons-vue'

const iconMap: Record<string, any> = {
  // ... 现有图标
  YourIconOutlined,
}
```

### 5. 工具会自动显示

完成上述步骤后，工具会自动：
- 出现在侧边菜单中（通过 `menu_utils.ts` 从路由自动生成）
- 显示在工具首页的卡片列表中（通过 `tool_utils.ts` 从路由提取）
- 支持搜索功能（通过 `search_utils.ts`）

## 设计规范

### 颜色使用

**主题色：**
- 主色：`#ff9b17`（橙色）- 用于主要按钮、重要文字
- 背景色：`rgb(255, 248, 230)` - 用于突出显示区域
- 边框/分割线：`#f0f0f0`

**文字颜色：**
- 标题/重要：`#262626`
- 正文：`#595959`
- 次要信息：`#8c8c8c`

### 间距规范

- 小组件间距：`8px`
- 常规间距：`12px`、`16px`
- 区块间距：`24px`
- 大区块间距：`32px`

### 圆角规范

- 小元素（按钮、输入框）：`6px`
- 卡片、容器：`8px`
- 大展示区域：`12px`

### 阴影规范

- 轻微阴影：`0 2px 8px rgba(0, 0, 0, 0.06)`
- 中等阴影：`0 4px 12px rgba(0, 0, 0, 0.08)`

### 命名规范

- 组件文件：PascalCase（如 `StopwatchTool.vue`）
- CSS类名：BEM命名法（`block__element--modifier`）
- 路由path：kebab-case（如 `stopwatch-tool`）
- 路由name：PascalCase（如 `StopwatchTool`）

### 技术栈使用

- Vue 3 Composition API with `<script setup>`
- TypeScript 类型安全
- Ant Design Vue 4.x 组件库（已全局注册，直接使用）
- 优先使用项目已有的依赖
- 使用 `message` 组件提供用户反馈

## 测试验证

创建工具后，请验证：
1. 路由能正常访问
2. 工具功能正常工作
3. UI美观，符合设计规范
4. 交互流畅，有适当的反馈
5. 在工具首页能看到工具卡片
6. 侧边菜单显示正确
7. 搜索功能可以找到该工具

运行 `npm run dev` 启动开发服务器进行测试。
