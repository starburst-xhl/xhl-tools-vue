<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownloadOutlined, ClearOutlined, FileImageOutlined } from '@ant-design/icons-vue'
import ToolTips from '@/components/ToolTips.vue'

// ── 状态 ──
const svgInput = ref('')
const svgPreviewUrl = ref('')
const svgWidth = ref(0)
const svgHeight = ref(0)
const hasValidSvg = ref(false)
const isLoading = ref(false)
const imgLoadFailed = ref(false)

// 颜色自定义
interface ColorItem {
  original: string
  current: string
  attribute: string // fill / stroke / stop-color
}
const detectedColors = ref<ColorItem[]>([])

// 导出尺寸
const exportWidth = ref(800)
const exportHeight = ref(600)

// ── DOMPurify 懒加载（避免 SSR 问题） ──
let _dompurify: typeof import('dompurify').default | null = null
async function getDOMPurify() {
  if (!_dompurify) {
    if (typeof window === 'undefined') {
      throw new Error('DOMPurify is only available in browser')
    }
    const mod = await import('dompurify')
    _dompurify = mod.default
  }
  return _dompurify
}

// ── SVG 安全清洗 ──
async function sanitizeSvg(raw: string): Promise<string> {
  const purify = await getDOMPurify()
  return purify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    ADD_ATTR: ['transform', 'viewBox', 'preserveAspectRatio', 'xmlns'],
  })
}

// ── SVG 转 base64 data URI（兼容 CSP，编码可靠） ──
function svgToDataUri(svg: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svg)))
  return `data:image/svg+xml;base64,${base64}`
}

// ── 从 SVG 字符串中提取颜色 ──
function extractColors(svgString: string): ColorItem[] {
  const result: ColorItem[] = []
  const seen = new Set<string>()

  // 匹配 fill="color" / stroke="color" / stop-color="color"
  const attrRegex = /(fill|stroke|stop-color)\s*=\s*["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = attrRegex.exec(svgString)) !== null) {
    const attr = match[1].toLowerCase()
    const color = match[2].trim().toLowerCase()
    if (
      color === 'none' ||
      color === 'transparent' ||
      color === 'currentcolor' ||
      color.startsWith('url(') ||
      color.startsWith('var(')
    )
      continue
    const key = `${attr}:${color}`
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ original: color, current: color, attribute: attr })
    }
  }

  // 匹配 style 属性中的 fill/stroke
  const styleRegex = /style\s*=\s*["']([^"']*)["']/gi
  while ((match = styleRegex.exec(svgString)) !== null) {
    const styleContent = match[1]
    const propRegex = /(fill|stroke)\s*:\s*([^;]+)/gi
    let propMatch: RegExpExecArray | null
    while ((propMatch = propRegex.exec(styleContent)) !== null) {
      const attr = propMatch[1].toLowerCase()
      const color = propMatch[2].trim().toLowerCase()
      if (
        color === 'none' ||
        color === 'transparent' ||
        color === 'currentcolor' ||
        color.startsWith('url(') ||
        color.startsWith('var(')
      )
        continue
      const key = `style:${attr}:${color}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ original: color, current: color, attribute: `${attr} (style)` })
      }
    }
  }

  return result
}

// ── 替换 SVG 中的颜色 ──
function replaceColors(svgString: string, colorMap: ColorItem[]): string {
  let result = svgString
  for (const item of colorMap) {
    if (item.current === item.original) continue
    const escaped = item.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const attrPart = item.attribute.includes('style') ? item.attribute.split(' ')[0] : item.attribute
    // 替换属性值中的颜色
    const attrRegex = new RegExp(
      `(${attrPart}\\s*=\\s*["'])(${escaped})(["'])`,
      'gi'
    )
    result = result.replace(attrRegex, `$1${item.current}$3`)
    // 替换 style 中的颜色
    const styleRegex = new RegExp(
      `(${attrPart}\\s*:\\s*)(${escaped})([;"'])`,
      'gi'
    )
    result = result.replace(styleRegex, `$1${item.current}$3`)
  }
  return result
}

// ── SVG 尺寸解析 ──
function parseSvgDimensions(svgString: string): { width: number; height: number } {
  const viewBoxMatch = svgString.match(/viewBox\s*=\s*["']([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)["']/)
  if (viewBoxMatch) {
    return { width: parseFloat(viewBoxMatch[3]), height: parseFloat(viewBoxMatch[4]) }
  }
  const widthMatch = svgString.match(/width\s*=\s*["'](\d+(?:\.\d+)?)/)
  const heightMatch = svgString.match(/height\s*=\s*["'](\d+(?:\.\d+)?)/)
  return {
    width: widthMatch ? parseFloat(widthMatch[1]) : 300,
    height: heightMatch ? parseFloat(heightMatch[1]) : 300,
  }
}

// ── 渲染 SVG 预览（核心函数） ──
async function renderPreview() {
  const raw = svgInput.value.trim()
  if (!raw) {
    svgPreviewUrl.value = ''
    hasValidSvg.value = false
    detectedColors.value = []
    return
  }

  try {
    // 1. XSS 清洗
    const cleaned = await sanitizeSvg(raw)

    // 2. 提取颜色（仅在输入变化时更新，颜色变更时不重新提取）
    if (detectedColors.value.length === 0 || detectedColors.value.every(c => c.current === c.original)) {
      detectedColors.value = extractColors(cleaned)
    }

    // 3. 颜色替换
    let final = cleaned
    if (detectedColors.value.some(c => c.current !== c.original)) {
      final = replaceColors(final, detectedColors.value)
    }

    // 4. base64 data URI（CSP 白名单已包含 data:）
    svgPreviewUrl.value = svgToDataUri(final)
    imgLoadFailed.value = false

    // 5. 解析尺寸
    const dims = parseSvgDimensions(cleaned)
    svgWidth.value = dims.width
    svgHeight.value = dims.height

    hasValidSvg.value = true
  } catch {
    message.error('SVG 解析失败，请检查代码是否正确')
    svgPreviewUrl.value = ''
    hasValidSvg.value = false
  }
}

// ── watch 防抖驱动渲染（替代 @input 事件） ──
let debounceTimer: number | null = null
watch(svgInput, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    // 输入变化时重置颜色列表，重新提取
    detectedColors.value = []
    renderPreview()
  }, 300)
})

// ── 颜色变更时重新渲染 ──
watch(
  () => detectedColors.value.map(c => c.current),
  () => {
    if (svgInput.value.trim() && detectedColors.value.some(c => c.current !== c.original)) {
      renderPreview()
    }
  },
  { deep: true }
)

// ── 加载示例 SVG ──
function loadExample() {
  svgInput.value = EXAMPLE_SVG.trim()
}

// ── 清空 ──
function clearAll() {
  svgInput.value = ''
  svgPreviewUrl.value = ''
  hasValidSvg.value = false
  imgLoadFailed.value = false
  detectedColors.value = []
  svgWidth.value = 0
  svgHeight.value = 0
}

// ── 导出为 PNG / JPG ──
async function exportImage(format: 'png' | 'jpg') {
  if (!svgPreviewUrl.value) {
    message.warning('请先输入有效的 SVG 代码')
    return
  }

  isLoading.value = true
  try {
    const canvas = document.createElement('canvas')
    canvas.width = exportWidth.value
    canvas.height = exportHeight.value
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 不支持')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        if (format === 'jpg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve()
      }
      img.onerror = () => reject(new Error('SVG 渲染失败'))
      img.src = svgPreviewUrl.value
    })

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    canvas.toBlob((blob) => {
      if (!blob) {
        message.error('导出失败')
        return
      }
      const ext = format === 'png' ? 'png' : 'jpg'
      downloadBlob(blob, `svg-export.${ext}`)
      message.success(`已导出为 ${format.toUpperCase()}`)
    }, mimeType, format === 'jpg' ? 0.92 : undefined)
  } catch {
    message.error('导出失败，请检查 SVG 代码')
  } finally {
    isLoading.value = false
  }
}

// ── 导出为 ICO ──
async function exportIco() {
  if (!svgPreviewUrl.value) {
    message.warning('请先输入有效的 SVG 代码')
    return
  }

  isLoading.value = true
  try {
    const icoSize = 256
    const canvas = document.createElement('canvas')
    canvas.width = icoSize
    canvas.height = icoSize
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 不支持')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const scale = Math.min(icoSize / svgWidth.value, icoSize / svgHeight.value)
        const w = svgWidth.value * scale
        const h = svgHeight.value * scale
        const x = (icoSize - w) / 2
        const y = (icoSize - h) / 2
        ctx.drawImage(img, x, y, w, h)
        resolve()
      }
      img.onerror = () => reject(new Error('SVG 渲染失败'))
      img.src = svgPreviewUrl.value
    })

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    })

    if (!pngBlob) {
      message.error('导出失败')
      return
    }

    const pngData = await pngBlob.arrayBuffer()
    const icoBlob = createIcoFromPng(pngData, icoSize, icoSize)
    downloadBlob(icoBlob, 'svg-export.ico')
    message.success('已导出为 ICO')
  } catch {
    message.error('导出失败，请检查 SVG 代码')
  } finally {
    isLoading.value = false
  }
}

// ── ICO 格式封装（PNG 数据 → ICO 容器） ──
function createIcoFromPng(pngData: ArrayBuffer, width: number, height: number): Blob {
  const headerSize = 6
  const entrySize = 16
  const dataOffset = headerSize + entrySize
  const totalSize = dataOffset + pngData.byteLength

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  // ICO Header
  view.setUint16(0, 0, true)  // Reserved: 0
  view.setUint16(2, 1, true)  // Type: ICO
  view.setUint16(4, 1, true)  // Count: 1 image

  // Directory Entry
  view.setUint8(6, width >= 256 ? 0 : width)
  view.setUint8(7, height >= 256 ? 0 : height)
  view.setUint8(8, 0)   // Color palette: 0
  view.setUint8(9, 0)   // Reserved: 0
  view.setUint16(10, 1, true)   // Color planes
  view.setUint16(12, 32, true)   // Bits per pixel
  view.setUint32(14, pngData.byteLength, true)  // Image size
  view.setUint32(18, dataOffset, true)           // Image offset

  // Copy PNG image data
  const pngBytes = new Uint8Array(buffer, dataOffset, pngData.byteLength)
  pngBytes.set(new Uint8Array(pngData))

  return new Blob([buffer], { type: 'image/x-icon' })
}

// ── Blob 下载 ──
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = filename
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

// ── 示例 SVG ──
const EXAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9b17"/>
      <stop offset="100%" stop-color="#ff6b6b"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#bg)"/>
  <circle cx="100" cy="100" r="60" fill="#ffffff"/>
  <text x="100" y="95" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#333333" font-weight="bold">SVG</text>
  <text x="100" y="120" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" fill="#666666">RENDER</text>
</svg>`

// ── 组件卸载时清理 ──
onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="svg-renderer">
    <div class="tool-content">
      <!-- SVG 输入 -->
      <div>
        <label class="section-label">SVG 代码</label>
        <a-textarea
          v-model:value="svgInput"
          :rows="8"
          placeholder="在此粘贴 SVG 代码..."
        />
      </div>

      <div class="button-container">
        <a-button @click="loadExample">
          <template #icon><FileImageOutlined /></template>
          加载示例
        </a-button>
        <a-button @click="clearAll" :disabled="!svgInput">
          <template #icon><ClearOutlined /></template>
          清空
        </a-button>
      </div>

      <!-- SVG 预览 -->
      <div v-if="hasValidSvg" class="content-card">
        <div class="section-title">SVG 预览</div>
        <div class="svg-renderer__preview">
          <img
            v-if="svgPreviewUrl && !imgLoadFailed"
            :src="svgPreviewUrl"
            alt="SVG Preview"
            class="svg-renderer__preview-img"
            @error="imgLoadFailed = true"
          />
          <div v-if="imgLoadFailed" class="svg-renderer__error">
            SVG 渲染失败，请检查代码是否包含不支持的特性
          </div>
        </div>
        <div class="svg-renderer__info">
          <span>尺寸：{{ svgWidth }} × {{ svgHeight }} px</span>
        </div>
      </div>

      <!-- 颜色自定义 -->
      <div v-if="detectedColors.length > 0" class="content-card">
        <div class="section-title">颜色自定义</div>
        <div class="svg-renderer__colors">
          <div
            v-for="(item, index) in detectedColors"
            :key="index"
            class="svg-renderer__color-item"
          >
            <input
              type="color"
              :value="item.current"
              class="svg-renderer__color-picker"
              @input="item.current = ($event.target as HTMLInputElement).value"
            />
            <span class="svg-renderer__color-label">{{ item.attribute }}</span>
            <span class="svg-renderer__color-value">{{ item.current }}</span>
            <a-button
              v-if="item.current !== item.original"
              type="link"
              size="small"
              @click="item.current = item.original"
            >
              还原
            </a-button>
          </div>
        </div>
      </div>

      <!-- 导出 -->
      <div v-if="hasValidSvg" class="content-card">
        <div class="section-title">导出图片</div>
        <div class="svg-renderer__export">
          <div class="svg-renderer__export-size">
            <label class="svg-renderer__size-label">宽度</label>
            <a-input-number
              v-model:value="exportWidth"
              :min="16"
              :max="4096"
              :step="1"
              style="width: 120px"
            />
            <label class="svg-renderer__size-label">高度</label>
            <a-input-number
              v-model:value="exportHeight"
              :min="16"
              :max="4096"
              :step="1"
              style="width: 120px"
            />
            <a-button
              type="link"
              size="small"
              @click="exportWidth = svgWidth; exportHeight = svgHeight"
            >
              原始尺寸
            </a-button>
          </div>
          <div class="button-container">
            <a-button type="primary" :loading="isLoading" @click="exportImage('png')">
              <template #icon><DownloadOutlined /></template>
              导出 PNG
            </a-button>
            <a-button :loading="isLoading" @click="exportImage('jpg')">
              <template #icon><DownloadOutlined /></template>
              导出 JPG
            </a-button>
            <a-button :loading="isLoading" @click="exportIco">
              <template #icon><DownloadOutlined /></template>
              导出 ICO
            </a-button>
          </div>
        </div>
      </div>

      <!-- ToolTips -->
      <ToolTips :tips="[
        '支持标准 SVG 标签，自动过滤危险脚本和事件处理器',
        '自动识别 SVG 中的 fill、stroke 颜色，点击色块即可修改',
        '导出尺寸可自定义，PNG 支持透明背景，JPG 为白色背景',
        'ICO 导出固定为 256×256，图标内容居中保持比例',
        '所有处理在浏览器本地完成，SVG 代码不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.svg-renderer {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

/* ── 统一结构样式 ── */
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

/* ── SVG 预览 ── */
.svg-renderer__preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
  min-height: 120px;
  overflow: auto;
}

.svg-renderer__preview-img {
  max-width: 100%;
  max-height: 360px;
  object-fit: contain;
}

.svg-renderer__info {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  text-align: center;
}

.svg-renderer__error {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--spacing-lg);
}

/* ── 颜色自定义 ── */
.svg-renderer__colors {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.svg-renderer__color-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  transition: var(--transition-fast);
}

.svg-renderer__color-item:hover {
  border-color: var(--color-primary);
}

.svg-renderer__color-picker {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: none;
}

.svg-renderer__color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.svg-renderer__color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.svg-renderer__color-label {
  font-size: var(--font-size-caption);
  color: var(--color-text-tertiary);
  min-width: 48px;
}

.svg-renderer__color-value {
  font-size: var(--font-size-caption);
  font-family: 'Courier New', monospace;
  color: var(--color-text-secondary);
  min-width: 64px;
}

/* ── 导出 ── */
.svg-renderer__export {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.svg-renderer__export-size {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.svg-renderer__size-label {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .svg-renderer__export-size {
    flex-wrap: wrap;
  }

  .svg-renderer__colors {
    flex-direction: column;
  }

  .svg-renderer__preview-img {
    max-height: 240px;
  }
}
</style>
