<script setup lang="ts">
import { computed } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import type { OpmlNode } from '@/utils/Tools/opml_types'

const props = defineProps<{
  node: OpmlNode
  depth?: number
}>()

const emit = defineEmits<{
  (e: 'toggle', node: OpmlNode): void
}>()

const depth = computed(() => props.depth ?? 0)
const hasChildren = computed(() => props.node.children.length > 0)
const isRss = computed(() => props.node.type === 'rss')
const isLink = computed(() => props.node.type === 'link')
const isFolder = computed(() => hasChildren.value)

const toggle = () => {
  emit('toggle', props.node)
}
</script>

<template>
  <div class="node-item">
    <!-- 节点行 -->
    <div
      class="node-row"
      :class="{
        'node-row--folder': isFolder,
        'node-row--rss': isRss,
        'node-row--link': isLink,
      }"
      :style="{ paddingLeft: (depth * 20) + 'px' }"
      @click="hasChildren ? toggle() : undefined"
    >
      <!-- 展开/折叠图标 -->
      <span v-if="hasChildren" class="node-toggle" :class="{ 'node-toggle--expanded': !node.collapsed }">
        <RightOutlined />
      </span>
      <span v-else class="node-toggle node-toggle--placeholder" />

      <!-- 节点类型图标 -->
      <span class="node-icon">
        <template v-if="isRss">📡</template>
        <template v-else-if="isLink">🔗</template>
        <template v-else-if="isFolder && node.collapsed">📁</template>
        <template v-else-if="isFolder && !node.collapsed">📂</template>
        <template v-else>📄</template>
      </span>

      <!-- 节点文本 -->
      <span class="node-text" :class="{ 'node-text--folder': isFolder }">
        {{ node.text }}
      </span>

      <!-- 类型标签 -->
      <span v-if="node.type && !isFolder" class="node-badge" :class="`node-badge--${node.type}`">
        {{ node.type }}
      </span>

      <!-- 子节点数 -->
      <span v-if="hasChildren" class="node-count">{{ node.children.length }}</span>
    </div>

    <!-- 展开的 URL 信息 -->
    <div
      v-if="!node.collapsed && hasChildren"
      class="node-children"
    >
      <OpmlNodeItem
        v-for="(child, index) in node.children"
        :key="`${child.text}-${index}`"
        :node="child"
        :depth="depth + 1"
        @toggle="emit('toggle', $event)"
      />
    </div>

    <!-- 叶子节点的额外信息 -->
    <div
      v-if="!hasChildren && (node.xmlUrl || node.htmlUrl || node.description)"
      class="node-detail"
      :style="{ paddingLeft: ((depth + 1) * 20 + 12) + 'px' }"
    >
      <div v-if="node.xmlUrl" class="detail-row">
        <span class="detail-label">RSS</span>
        <a
          :href="node.xmlUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="detail-link"
          @click.stop
        >
          {{ node.xmlUrl }}
        </a>
      </div>
      <div v-if="node.htmlUrl" class="detail-row">
        <span class="detail-label">网站</span>
        <a
          :href="node.htmlUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="detail-link"
          @click.stop
        >
          {{ node.htmlUrl }}
        </a>
      </div>
      <div v-if="node.description" class="detail-row">
        <span class="detail-label">描述</span>
        <span class="detail-text">{{ node.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-item {
  user-select: none;
}

.node-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  cursor: default;
  transition: background var(--transition-fast);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
}

.node-row:hover {
  background: var(--color-bg-hover);
}

.node-row--folder {
  cursor: pointer;
}

.node-row--folder .node-text {
  font-weight: var(--font-weight-semibold);
}

.node-row--rss {
  color: #e68a00;
}

.node-row--link {
  color: var(--color-info);
}

/* 折叠图标 */
.node-toggle {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-text-tertiary);
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}

.node-toggle--expanded {
  transform: rotate(90deg);
}

.node-toggle--placeholder {
  visibility: hidden;
}

/* 图标 */
.node-icon {
  font-size: 14px;
  flex-shrink: 0;
}

/* 文本 */
.node-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 类型标签 */
.node-badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: var(--radius-sm);
  line-height: 1.6;
  flex-shrink: 0;
}

.node-badge--rss {
  background: #fff7e6;
  color: #e68a00;
  border: 1px solid #ffd591;
}

.node-badge--link {
  background: #e6f7ff;
  color: var(--color-info);
  border: 1px solid #91d5ff;
}

/* 子节点计数 */
.node-count {
  font-size: 11px;
  color: var(--color-text-tertiary);
  background: var(--color-bg);
  padding: 1px 6px;
  border-radius: 10px;
  flex-shrink: 0;
}

/* 叶子节点详情 */
.node-detail {
  padding: 4px 0 8px 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: 12px;
}

.detail-label {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  min-width: 32px;
}

.detail-link {
  color: var(--color-primary);
  word-break: break-all;
  text-decoration: none;
}
.detail-link:hover {
  text-decoration: underline;
}

.detail-text {
  color: var(--color-text-secondary);
  word-break: break-all;
}
</style>
