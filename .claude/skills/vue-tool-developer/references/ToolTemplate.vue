<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { copyToClipboard } from "@/utils/clipboard_utils";
import ToolTips from "@/components/ToolTips.vue";

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
  } catch {
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

// 复制函数 — 使用项目封装的 copyToClipboard（带 SSR 守卫）
const copyResult = async () => {
  await copyToClipboard(result.value, "已复制到剪贴板", "复制失败");
};
</script>

<template>
  <div class="tool-template">
    <div class="tool-content">
      <!-- 输入区域 -->
      <div>
        <label class="section-label">输入内容</label>
        <a-textarea
          v-model:value="inputValue"
          placeholder="请输入需要处理的内容..."
          :rows="4"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="button-container">
        <a-button
          type="primary"
          :loading="isLoading"
          @click="processInput"
        >
          处理
        </a-button>
        <a-button @click="resetForm">
          重置
        </a-button>
      </div>

      <!-- 结果展示 -->
      <div v-if="result" class="content-card">
        <div class="card-header">
          <div class="section-title">处理结果</div>
          <a-button type="link" size="small" @click="copyResult">
            复制
          </a-button>
        </div>
        <p class="result-text">{{ result }}</p>
      </div>

      <ToolTips :tips="[
        '所有处理在浏览器本地完成，数据不会上传到服务器',
        '处理成功后可点击复制按钮将结果复制到剪贴板',
      ]" />
    </div>
  </div>
</template>

<style scoped>
/* 页面根容器 — 只设 width，不要加背景/边框/圆角 */
.tool-template {
  width: 100%;
}

/* 内容布局 — flex column + gap */
.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 按钮容器 — 居中排列 */
.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* ===== 统一样式规范：以下为标准定义，所有工具页面统一使用 ===== */

/* 区段标签 — 标记输入框/输出框等小区域 */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

/* 区块标题 — 内容卡片内的区块头部 */
.section-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

/* 内容卡片 — 子区块容器（不要给根元素加卡片样式） */
.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

/* 卡片头部 — 标题 + 右侧操作按钮 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

/* 卡片头部内的 section-title 不需要额外 margin-bottom（card-header 已处理） */
.card-header .section-title {
  margin-bottom: 0;
}

/* 结果文字 */
.result-text {
  margin: 0;
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .button-container {
    flex-direction: column;
  }
  .button-container .ant-btn {
    width: 100%;
  }
}
</style>