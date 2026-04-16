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
