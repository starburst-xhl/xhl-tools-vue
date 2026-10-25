<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ClockCircleOutlined } from "@ant-design/icons-vue";
import ToolTips from "@/components/ToolTips.vue";
import { copyToClipboard } from "@/utils/clipboard_utils";
import {
  formatDateTime,
  parseDateTimeInput,
  type DateTimeResultItem,
} from "@/utils/Tools/datetime_utils";

const inputValue = ref("");

const parsedDate = computed(() => parseDateTimeInput(inputValue.value));
const hasInput = computed(() => inputValue.value.trim().length > 0);
const results = computed<DateTimeResultItem[]>(() => {
  const d = parsedDate.value;
  return d ? formatDateTime(d) : [];
});

const useCurrentTime = () => {
  inputValue.value = String(Date.now());
};

const clearInput = () => {
  inputValue.value = "";
};

const copyResult = async (item: DateTimeResultItem) => {
  await copyToClipboard(item.value, `${item.label}已复制`);
};

// 客户端初始化当前时间，避免 SSR 水合不一致
onMounted(() => {
  useCurrentTime();
});
</script>

<template>
  <div class="datetime-converter">
    <div class="datetime-converter__section">
      <label class="section-label">输入时间</label>
      <a-input
        v-model:value="inputValue"
        placeholder="输入 Unix 时间戳（秒/毫秒）或日期时间，如 1700000000 或 2024-01-01 12:00:00"
        allow-clear
        class="datetime-converter__input"
      />
      <div class="datetime-converter__actions">
        <a-button type="primary" @click="useCurrentTime">
          <template #icon>
            <ClockCircleOutlined />
          </template>
          当前时间
        </a-button>
        <a-button @click="clearInput">清空</a-button>
      </div>
      <p class="datetime-converter__hint">
        支持 Unix 时间戳（10 位为秒、13 位为毫秒）与常见日期时间字符串，输入后自动转换
      </p>
    </div>

    <div v-if="results.length" class="datetime-converter__section">
      <label class="section-label">转换结果</label>
      <div class="datetime-converter__grid">
        <div
          v-for="item in results"
          :key="item.key"
          class="datetime-converter__item"
          @click="copyResult(item)"
        >
          <div class="datetime-converter__item-label">{{ item.label }}</div>
          <div class="datetime-converter__item-value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div v-else-if="hasInput" class="content-card datetime-converter__empty">
      无法识别输入内容，请输入有效的时间戳或日期时间字符串
    </div>

    <ToolTips :tips="[
      '支持 Unix 时间戳与日期时间字符串双向转换',
      '自动识别时间戳单位：10 位为秒，13 位为毫秒',
      '点击任意结果卡片即可复制对应格式',
      '所有转换在浏览器本地完成，数据不会上传到服务器',
    ]" />
  </div>
</template>

<style scoped>
.datetime-converter {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.datetime-converter__section {
  display: flex;
  flex-direction: column;
}

/* ===== 统一样式规范 ===== */

/* 区段标签 — 标记输入框/结果区等区域 */
.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

/* 内容卡片 — 子区块容器 */
.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

/* ===== 工具特有样式 ===== */

.datetime-converter__input {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.datetime-converter__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.datetime-converter__hint {
  margin: var(--spacing-md) 0 0;
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-body);
}

.datetime-converter__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.datetime-converter__item {
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-fast);
}

.datetime-converter__item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.datetime-converter__item-label {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.datetime-converter__item-value {
  font-size: var(--font-size-body);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  word-break: break-all;
}

.datetime-converter__empty {
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body);
}

@media (max-width: 767px) {
  .datetime-converter__actions {
    flex-direction: column;
  }

  .datetime-converter__actions .ant-btn {
    width: 100%;
  }

  .datetime-converter__grid {
    grid-template-columns: 1fr;
  }
}
</style>
