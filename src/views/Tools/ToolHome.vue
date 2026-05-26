<script setup lang="ts">
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import ToolCard from '@/components/tools/ToolCard.vue'
import { extractToolsFromRoutes, type Tool } from '@/utils/tool_utils'
import { routes } from '@/router/index'

const searchQuery = ref('')
const allTools = ref<Tool[]>([])
let fuseInstance: Fuse<Tool> | null = null

// 提取所有工具（移到 setup 阶段，确保 SSR 也能渲染）
const rootRoute = routes.find((r) => r.path === '/')
if (rootRoute && rootRoute.children) {
  const toolsRoute = rootRoute.children.find((r) => r.path === '/tools')
  if (toolsRoute && toolsRoute.children) {
    // 提取所有工具，排除工具首页本身
    allTools.value = extractToolsFromRoutes(toolsRoute.children).filter(
      (tool) => tool.name !== 'ToolHome'
    )

    // 初始化 Fuse.js
    fuseInstance = new Fuse(allTools.value, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'description', weight: 0.4 },
      ],
      threshold: 0.3,
    })
  }
}

// 过滤后的工具列表
const filteredTools = computed(() => {
  if (!searchQuery.value || !fuseInstance) {
    return allTools.value
  }

  const results = fuseInstance.search(searchQuery.value)
  return results.map((result) => result.item)
})

// 工具统计文本
const statsText = computed(() => {
  const total = allTools.value.length
  const filtered = filteredTools.value.length

  if (searchQuery.value) {
    return `找到 ${filtered} 个工具（共 ${total} 个）`
  }
  return `共 ${total} 个工具`
})
</script>

<template>
  <div class="tool-home">
    <div class="tool-home__header">
      <h2 class="page-title">工具集合</h2>
      <p class="page-description">浏览 XHL Tools 提供的所有在线工具，支持快速搜索和分类查找，所有工具都在浏览器本地运行，无需上传数据，安全可靠。</p>
    </div>

    <div class="tool-home__search">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索工具..."
        size="large"
        allow-clear
        autofocus
        class="search-input"
      />
    </div>

    <div class="tool-home__stats">
      <span class="stats-text">{{ statsText }}</span>
    </div>

    <div v-if="filteredTools.length === 0" class="tool-home__empty">
      <p class="empty-text">未找到相关工具</p>
      <p class="empty-hint">请尝试其他关键词</p>
    </div>

    <div v-else class="tool-home__grid">
      <ToolCard
        v-for="tool in filteredTools"
        :key="tool.name"
        :tool="tool"
        class="tool-home__card"
      />
    </div>

    <div class="tool-home__footer">
      <h3 class="footer-title">为什么选择 XHL Tools？</h3>
      <ul class="feature-list">
        <li class="feature-item">
          <span class="feature-icon">🔒</span>
          <span class="feature-text">所有数据本地处理，保护您的隐私安全</span>
        </li>
        <li class="feature-item">
          <span class="feature-icon">⚡</span>
          <span class="feature-text">无需安装，即开即用，响应速度快</span>
        </li>
        <li class="feature-item">
          <span class="feature-icon">🎯</span>
          <span class="feature-text">界面简洁，专注于功能实用性</span>
        </li>
        <li class="feature-item">
          <span class="feature-icon">📱</span>
          <span class="feature-text">响应式设计，支持各种设备访问</span>
        </li>
        <li class="feature-item">
          <span class="feature-icon">💻</span>
          <span class="feature-text">开源免费，可自由使用和贡献代码</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tool-home {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-home__header {
  margin-bottom: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  text-align: center;
}

.page-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

.page-description {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: var(--line-height-body);
}

.tool-home__search {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.search-input {
  width: 100%;
  max-width: 600px;
}

.tool-home__stats {
  margin-bottom: var(--spacing-sm);
}

.stats-text {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.search-input :deep(.ant-input-affix-wrapper) {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
  padding: var(--spacing-md) var(--spacing-lg);
}

.search-input :deep(.ant-input-affix-wrapper:hover) {
  border-color: var(--color-primary);
}

.search-input :deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(255, 155, 23, 0.1);
}

.search-input :deep(input.ant-input) {
  font-size: var(--font-size-body);
  border: none;
  background: transparent;
  padding: 0;
}

.search-input :deep(input.ant-input:focus) {
  box-shadow: none;
}

.tool-home__grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-lg);
}

.tool-home__card {
  /* 卡片样式 */
}

.tool-home__empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-xxxxl) var(--spacing-lg);
  color: var(--color-text-tertiary);
}

.empty-text {
  font-size: var(--font-size-h4);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.empty-hint {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
}

.tool-home__footer {
  margin-top: var(--spacing-xxxl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.footer-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}

/* 响应式断点 */
@media (max-width: 767px) {
  .tool-home__search {
    margin-bottom: var(--spacing-lg);
  }

  .page-title {
    font-size: var(--font-size-h3);
  }

  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>

