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
  <div class="tool-template">
    <!-- 输入区域 -->
    <div class="tool-template__input-section">
      <a-input
        v-model:value="inputValue"
        placeholder="请输入内容"
        size="large"
        class="tool-template__input"
        @pressEnter="processInput"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="tool-template__actions">
      <a-button
        type="primary"
        size="large"
        :loading="isLoading"
        @click="processInput"
      >
        处理
      </a-button>
      <a-button size="large" @click="resetForm">
        重置
      </a-button>
    </div>

    <!-- 结果展示 -->
    <a-card v-if="result" class="tool-template__result">
      <template #title>
        <div class="tool-template__result-header">
          <span>处理结果</span>
          <a-button type="link" size="small" @click="copyResult">
            复制
          </a-button>
        </div>
      </template>
      <p class="tool-template__result-text">{{ result }}</p>
    </a-card>
  </div>
</template>

<style scoped>
.tool-template {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 500px;
  animation: fadeIn var(--duration-normal) var(--easing-standard);
}

.tool-template__input-section {
  width: 100%;
}

.tool-template__input {
  width: 100%;
}

.tool-template__actions {
  display: flex;
  gap: var(--spacing-md-sm);
  justify-content: center;
}

.tool-template__result {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.tool-template__result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
}

.tool-template__result-text {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
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
