<template>
  <div class="tool-tips">
    <div v-for="(tip, index) in tips" :key="index" class="tool-tips__item">
      <CheckCircleOutlined class="tool-tips__icon" />
      <span class="tool-tips__text">{{ tip }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleOutlined } from '@ant-design/icons-vue'

defineProps<{
  /** 提示文本列表 */
  tips: string[]
}>()
</script>

<style scoped>
.tool-tips {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.tool-tips__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  line-height: var(--line-height-body);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
}

.tool-tips__icon {
  flex-shrink: 0;
  margin-top: 3px;
  font-size: 14px;
  color: var(--color-primary);
}

.tool-tips__text {
  flex: 1;
}
</style>
