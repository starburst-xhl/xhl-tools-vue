<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import ToolTips from '@/components/ToolTips.vue'
import OpmlNodeItem from '@/components/OpmlNodeItem.vue'
import type { OpmlNode, OpmlMeta } from '@/utils/Tools/opml_types'

const inputText = ref('')
const opmlMeta = reactive<OpmlMeta>({})
const outlineTree = ref<OpmlNode[]>([])
const parsed = ref(false)
const parseError = ref('')
const isLoading = ref(false)

/* eslint-disable vue/no-unknown-elements-selector --
    querySelector 操作在 XML(OPML) DOM 上，非 Vue 模板，
    outline/parsererror/opml/dateCreated 等均为 OPML 规范定义的 XML 元素 */
// 递归解析 outline 元素
const parseOutline = (element: Element): OpmlNode => {
  const node: OpmlNode = {
    text: element.getAttribute('text') || 'Untitled',
    type: element.getAttribute('type') || undefined,
    xmlUrl: element.getAttribute('xmlUrl') || undefined,
    htmlUrl: element.getAttribute('htmlUrl') || undefined,
    description: element.getAttribute('description') || undefined,
    children: [],
    collapsed: false,
  }

  const childOutlines = element.querySelectorAll(':scope > outline')
  childOutlines.forEach((child) => {
    node.children.push(parseOutline(child))
  })

  return node
}

// 解析 OPML 内容
const parseOpml = (xmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')

  // 检查解析错误
  const parseErrorNode = doc.querySelector('parsererror')
  if (parseErrorNode) {
    throw new Error('XML 格式不正确，请检查输入的 OPML 内容')
  }

  const opmlElement = doc.querySelector('opml')
  if (!opmlElement) {
    throw new Error('未找到 <opml> 根元素，请确认输入的是 OPML 格式')
  }

  // 解析 head 元数据
  const head = opmlElement.querySelector(':scope > head')
  if (head) {
    opmlMeta.title = head.querySelector('title')?.textContent || undefined
    opmlMeta.dateCreated = head.querySelector('dateCreated')?.textContent || undefined
    opmlMeta.dateModified = head.querySelector('dateModified')?.textContent || undefined
    opmlMeta.ownerName = head.querySelector('ownerName')?.textContent || undefined
    opmlMeta.ownerEmail = head.querySelector('ownerEmail')?.textContent || undefined
  }

  // 解析 body 中的 outline 树
  const body = opmlElement.querySelector(':scope > body')
  if (!body) {
    throw new Error('未找到 <body> 元素，OPML 格式不完整')
  }

  const rootOutlines = body.querySelectorAll(':scope > outline')
  outlineTree.value = Array.from(rootOutlines).map(parseOutline)
}
/* eslint-enable vue/no-unknown-elements-selector */

// 提交处理
const handleProcess = async () => {
  if (!inputText.value.trim()) {
    message.warning('请先输入 OPML 内容或上传 OPML 文件')
    return
  }

  isLoading.value = true
  parseError.value = ''

  try {
    await new Promise((resolve) => setTimeout(resolve, 100))
    parseOpml(inputText.value)
    parsed.value = true
    message.success('OPML 解析成功')
  } catch (e: unknown) {
    parseError.value = e instanceof Error ? e.message : 'XML 格式不正确，请检查输入的 OPML 内容'
    parsed.value = false
    message.error(parseError.value)
  } finally {
    isLoading.value = false
  }
}

// 重置
const resetForm = () => {
  inputText.value = ''
  outlineTree.value = []
  opmlMeta.title = undefined
  opmlMeta.dateCreated = undefined
  opmlMeta.dateModified = undefined
  opmlMeta.ownerName = undefined
  opmlMeta.ownerEmail = undefined
  parsed.value = false
  parseError.value = ''
}

// 文件上传处理
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    inputText.value = e.target?.result as string
    message.success('文件已加载')
  }
  reader.onerror = () => {
    message.error('文件读取失败')
  }
  reader.readAsText(file)

  // 清空 input 以便重复上传同一文件
  input.value = ''
}

// 切换节点折叠
const toggleCollapse = (node: OpmlNode) => {
  node.collapsed = !node.collapsed
}

// 展开所有
const expandAll = () => {
  const expand = (nodes: OpmlNode[]) => {
    nodes.forEach((n) => {
      n.collapsed = false
      expand(n.children)
    })
  }
  expand(outlineTree.value)
}

// 折叠所有
const collapseAll = () => {
  const collapse = (nodes: OpmlNode[]) => {
    nodes.forEach((n) => {
      if (n.children.length > 0) {
        n.collapsed = true
      }
      collapse(n.children)
    })
  }
  collapse(outlineTree.value)
}

// 递归统计节点数
const countNodes = (nodes: OpmlNode[]): number => {
  let count = nodes.length
  nodes.forEach((n) => (count += countNodes(n.children)))
  return count
}

const totalNodes = computed(() => countNodes(outlineTree.value))

// 加载示例
onMounted(() => {
  inputText.value = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>我的订阅列表</title>
    <dateCreated>2024-06-22T10:00:00Z</dateCreated>
    <ownerName>示例用户</ownerName>
  </head>
  <body>
    <outline text="技术博客">
      <outline text="阮一峰的网络日志" type="rss" xmlUrl="https://feeds.feedburner.com/ruanyifeng" htmlUrl="https://ruanyifeng.com/blog/"/>
      <outline text="酷壳 - CoolShell" type="rss" xmlUrl="https://coolshell.cn/feed" htmlUrl="https://coolshell.cn"/>
      <outline text="前端技术">
        <outline text="Vue.js 官方博客" type="rss" xmlUrl="https://blog.vuejs.org/feed.xml"/>
        <outline text="React Blog" type="rss" xmlUrl="https://reactjs.org/feed.xml"/>
        <outline text="CSS-Tricks" type="rss" xmlUrl="https://css-tricks.com/feed/"/>
      </outline>
    </outline>
    <outline text="新闻资讯">
      <outline text="Hacker News" type="rss" xmlUrl="https://hnrss.org/frontpage"/>
      <outline text="Solidot" type="rss" xmlUrl="https://www.solidot.org/index.rss"/>
    </outline>
    <outline text="设计灵感">
      <outline text="Dribbble Popular" type="rss" xmlUrl="https://dribbble.com/shots/popular.rss"/>
      <outline text="Behance Featured" htmlUrl="https://www.behance.net"/>
    </outline>
  </body>
</opml>`
})
</script>

<template>
  <div class="opml-viewer">
    <div class="tool-content">
      <!-- 输入区域 -->
      <div>
        <label class="section-label">OPML 内容</label>
        <a-textarea
          v-model:value="inputText"
          placeholder="请粘贴 OPML 内容，或点击下方上传按钮加载 .opml 文件..."
          :rows="8"
          class="text-input"
        />
        <div class="input-actions">
          <label class="upload-btn-root">
            <input
              type="file"
              accept=".opml,.xml"
              class="file-input-hidden"
              @change="handleFileUpload"
            />
            <span class="upload-btn">📁 上传 OPML 文件</span>
          </label>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="button-container">
        <a-button type="primary" :loading="isLoading" @click="handleProcess">
          解析渲染
        </a-button>
        <a-button @click="resetForm">重置</a-button>
      </div>

      <!-- 解析错误 -->
      <div v-if="parseError" class="error-card">
        <span class="error-text">{{ parseError }}</span>
      </div>

      <!-- 结果展示 -->
      <div v-if="parsed && outlineTree.length > 0" class="result-section">
        <!-- 元数据卡片 -->
        <div v-if="opmlMeta.title" class="content-card">
          <div class="section-title">概览信息</div>
          <div class="meta-grid">
            <div v-if="opmlMeta.title" class="meta-item">
              <span class="meta-label">标题</span>
              <span class="meta-value">{{ opmlMeta.title }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">节点总数</span>
              <span class="meta-value">{{ totalNodes }}</span>
            </div>
            <div v-if="opmlMeta.dateCreated" class="meta-item">
              <span class="meta-label">创建时间</span>
              <span class="meta-value">{{ opmlMeta.dateCreated }}</span>
            </div>
            <div v-if="opmlMeta.dateModified" class="meta-item">
              <span class="meta-label">修改时间</span>
              <span class="meta-value">{{ opmlMeta.dateModified }}</span>
            </div>
            <div v-if="opmlMeta.ownerName" class="meta-item">
              <span class="meta-label">作者</span>
              <span class="meta-value">{{ opmlMeta.ownerName }}</span>
            </div>
            <div v-if="opmlMeta.ownerEmail" class="meta-item">
              <span class="meta-label">邮箱</span>
              <span class="meta-value">{{ opmlMeta.ownerEmail }}</span>
            </div>
          </div>
        </div>

        <!-- 大纲树 -->
        <div class="content-card">
          <div class="card-header">
            <div class="section-title">大纲结构</div>
            <div class="card-actions">
              <a-button type="link" size="small" @click="expandAll">全部展开</a-button>
              <a-button type="link" size="small" @click="collapseAll">全部折叠</a-button>
            </div>
          </div>

          <div class="outline-tree">
            <OpmlNodeItem
              v-for="(node, index) in outlineTree"
              :key="`root-${node.text}-${index}`"
              :node="node"
              :depth="0"
              @toggle="toggleCollapse"
            />
          </div>
        </div>
      </div>

      <ToolTips :tips="[
        'OPML（Outline Processor Markup Language）是一种大纲标记语言，常用于 RSS 订阅列表、思维导图数据交换',
        '支持粘贴 OPML 内容或上传 .opml / .xml 格式文件',
        'RSS 源显示为橙色标签，普通链接显示为蓝色，文件夹节点加粗并可展开折叠',
        '所有处理在浏览器本地完成，数据不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.opml-viewer {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 输入区 */
.text-input {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.input-actions {
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
}

.file-input-hidden {
  display: none;
}

.upload-btn {
  font-size: var(--font-size-body);
  color: var(--color-primary);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.upload-btn:hover {
  opacity: 0.8;
}

/* 按钮容器 */
.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* 解析错误 */
.error-card {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.error-text {
  color: var(--color-error);
  font-size: var(--font-size-body);
}

/* 结果区域 */
.result-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== 统一样式规范 ===== */

.section-label {
  display: block;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

.content-card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-header .section-title {
  margin-bottom: 0;
}

.card-actions {
  display: flex;
  gap: var(--spacing-xs);
}

/* 元数据网格 */
.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.meta-value {
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
}

/* 大纲树 */
.outline-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .button-container {
    flex-direction: column;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
