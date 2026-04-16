<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Tool } from '@/utils/tool_utils'
import { getIconComponent } from '@/utils/tool_utils'

const props = defineProps<{
  tool: Tool
}>()

const router = useRouter()

// 获取图标组件
const IconComponent = computed(() => getIconComponent(props.tool.icon))

// 点击卡片跳转
function handleClick() {
  router.push({ name: props.tool.name })
}
</script>

<template>
  <div class="tool-card" @click="handleClick">
    <div class="tool-card__icon-wrapper">
      <component :is="IconComponent" class="tool-card__icon" />
    </div>
    
    <div class="tool-card__content">
      <h3 class="tool-card__title">
        {{ tool.title }}
      </h3>
      <p class="tool-card__description">{{ tool.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.tool-card {
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: var(--transition-normal);
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-lg);
}

.tool-card:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.tool-card__icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-normal);
}

.tool-card:hover .tool-card__icon-wrapper {
  transform: scale(1.05);
}

.tool-card__icon {
  font-size: 28px;
  color: var(--color-primary);
}

.tool-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tool-card__title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin: 0;
}

.tool-card__description {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: var(--line-height-body);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-card {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .tool-card__icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .tool-card__icon {
    font-size: 24px;
  }

  .tool-card__title {
    font-size: var(--font-size-body);
  }

  .tool-card__description {
    font-size: var(--font-size-body-sm);
  }
}
</style>
