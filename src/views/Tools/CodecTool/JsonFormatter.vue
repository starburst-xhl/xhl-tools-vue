<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";

// 状态定义
const inputValue = ref<string>("");
const result = ref<string>("");
const isLoading = ref<boolean>(false);

// JSON格式化
const formatJson = async () => {
  if (!inputValue.value.trim()) {
    message.warning("请输入JSON内容");
    return;
  }

  isLoading.value = true;
  try {
    const parsed = JSON.parse(inputValue.value);
    result.value = JSON.stringify(parsed, null, 2);
    message.success("格式化成功");
  } catch (error) {
    message.error("JSON格式不正确");
    result.value = "";
  } finally {
    isLoading.value = false;
  }
};

// JSON压缩
const compressJson = async () => {
  if (!inputValue.value.trim()) {
    message.warning("请输入JSON内容");
    return;
  }

  isLoading.value = true;
  try {
    const parsed = JSON.parse(inputValue.value);
    result.value = JSON.stringify(parsed);
    message.success("压缩成功");
  } catch (error) {
    message.error("JSON格式不正确");
    result.value = "";
  } finally {
    isLoading.value = false;
  }
};

// 重置
const resetForm = () => {
  inputValue.value = "";
  result.value = "";
};

// 复制结果
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
  <div class="json-formatter">
    <!-- 输入区域 -->
    <div class="json-formatter__input-section">
      <a-textarea
        v-model:value="inputValue"
        placeholder="请输入JSON内容..."
        :rows="8"
        class="json-formatter__textarea"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="json-formatter__actions">
      <a-button
        type="primary"
        :loading="isLoading"
        @click="formatJson"
      >
        格式化
      </a-button>
      <a-button
        :loading="isLoading"
        @click="compressJson"
      >
        压缩
      </a-button>
      <a-button @click="resetForm">
        重置
      </a-button>
    </div>

    <!-- 结果展示 -->
    <div v-if="result" class="json-formatter__result">
      <div class="json-formatter__result-header">
        <span class="json-formatter__result-title">处理结果</span>
        <a-button type="link" size="small" @click="copyResult">
          复制
        </a-button>
      </div>
      <pre class="json-formatter__result-text">{{ result }}</pre>
    </div>
  </div>
</template>

<style scoped>
.json-formatter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.json-formatter__input-section {
  width: 100%;
}

.json-formatter__textarea {
  width: 100%;
  font-family: 'Courier New', Consolas, monospace;
  font-size: var(--font-size-body-sm);
}

.json-formatter__actions {
  display: flex;
  gap: var(--spacing-md-sm);
  justify-content: center;
}

.json-formatter__result {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.json-formatter__result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.json-formatter__result-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
}

.json-formatter__result-text {
  margin: 0;
  padding: var(--spacing-md);
  font-family: 'Courier New', Consolas, monospace;
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
