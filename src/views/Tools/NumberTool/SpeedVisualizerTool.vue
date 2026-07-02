<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons-vue'
import ToolTips from '@/components/ToolTips.vue'

// ── 状态 ──
const speedRpm = ref(60) // 内部始终以 RPM 存储
const speedUnit = ref<'rpm' | 'rps' | 'rads'>('rpm')
const isCustomSvg = ref(false)
const customSvgInput = ref('')
const svgPreviewUrl = ref('')
const svgError = ref('')
const svgSource = ref('') // 已验证的原始 SVG 源码
const isAnimating = ref(true)

let animationId: number | null = null
let lastFrameTime = 0
const currentAngle = ref(0)

function svgToDataUri(svg: string): string {
  const utf8Bytes = new TextEncoder().encode(svg)
  const base64 = btoa(String.fromCharCode(...utf8Bytes))
  return `data:image/svg+xml;base64,${base64}`
}

// ── 显示值：切换单位时自动换算 ──
const rotationSpeed = computed({
  get: () => {
    switch (speedUnit.value) {
      case 'rps': return Math.round((speedRpm.value / 60) * 100) / 100
      case 'rads': return Math.round((speedRpm.value * 2 * Math.PI / 60) * 100) / 100
      default: return speedRpm.value
    }
  },
  set: (val: number) => {
    switch (speedUnit.value) {
      case 'rps': speedRpm.value = Math.round(val * 60 * 100) / 100; break
      case 'rads': speedRpm.value = Math.round((val * 60 / (2 * Math.PI)) * 100) / 100; break
      default: speedRpm.value = val
    }
  },
})

const inputStep = computed(() => speedUnit.value === 'rpm' ? 1 : 0.1)

// ── 默认轮子 SVG ──
function generateDefaultWheel(): string {
  const spokes = []
  for (let i = 0; i < 8; i++) {
    const angle = i * 45
    spokes.push(`<line x1="150" y1="150" x2="150" y2="30" stroke="#ff9b17" stroke-width="3" stroke-linecap="round" opacity="0.7" transform="rotate(${angle} 150 150)"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <circle cx="150" cy="150" r="135" fill="#fafafa" stroke="#e8e8e8" stroke-width="2"/>
    <circle cx="150" cy="150" r="120" fill="none" stroke="#ff9b17" stroke-width="2" opacity="0.3"/>
    ${spokes.join('\n    ')}
    <circle cx="150" cy="150" r="20" fill="#ff9b17"/>
    <circle cx="150" cy="150" r="8" fill="#ffffff"/>
  </svg>`
}

// ── 从 SVG 中解析 viewBox 或 width/height 中心坐标 ──
function parseViewBoxCenter(svg: string): { cx: number; cy: number } {
  const match = svg.match(/viewBox\s*=\s*["']([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)["']/)
  if (match) {
    const w = parseFloat(match[3])
    const h = parseFloat(match[4])
    return { cx: parseFloat(match[1]) + w / 2, cy: parseFloat(match[2]) + h / 2 }
  }
  // 没有 viewBox 时尝试用 width/height
  const wMatch = svg.match(/width\s*=\s*["'](\d+(?:\.\d+)?)["']/)
  const hMatch = svg.match(/height\s*=\s*["'](\d+(?:\.\d+)?)["']/)
  if (wMatch || hMatch) {
    return {
      cx: (wMatch ? parseFloat(wMatch[1]) : 300) / 2,
      cy: (hMatch ? parseFloat(hMatch[1]) : 300) / 2,
    }
  }
  return { cx: 150, cy: 150 }
}

// ── 将旋转角度注入 SVG 内部 ──
function injectRotation(svg: string, angle: number): string {
  const { cx, cy } = parseViewBoxCenter(svg)
  // 在 <svg> 开始标签后插入 <g>，在 </svg> 前插入 </g>
  const tagEnd = svg.indexOf('>', svg.indexOf('<svg')) + 1
  const closeTag = svg.lastIndexOf('</svg>')
  const before = svg.slice(0, tagEnd)
  const content = svg.slice(tagEnd, closeTag)
  const after = svg.slice(closeTag)
  return `${before}<g transform="rotate(${angle} ${cx} ${cy})">${content}</g>${after}`
}

// ── 更新 SVG 源码（输入变化时调用，验证并保存原始 SVG） ──
function updateSource() {
  let raw: string
  if (isCustomSvg.value && customSvgInput.value.trim()) {
    raw = customSvgInput.value.trim()
  } else {
    raw = generateDefaultWheel()
  }
  try {
    // 验证能否正常注入（如果 SVG 结构不对会抛异常）
    injectRotation(raw, 0)
    svgSource.value = raw
    svgError.value = ''
  } catch {
    svgSource.value = ''
    svgError.value = 'SVG 解析失败，请检查代码格式是否正确'
  }
  renderSvg()
}

// ── 渲染 SVG（动画循环调用，只注入角度，不重新验证） ──
function renderSvg() {
  if (!svgSource.value) {
    svgPreviewUrl.value = ''
    return
  }
  try {
    const rotated = injectRotation(svgSource.value, currentAngle.value)
    svgPreviewUrl.value = svgToDataUri(rotated)
  } catch {
    svgPreviewUrl.value = ''
  }
}

function animate(timestamp: number) {
  if (lastFrameTime === 0) lastFrameTime = timestamp
  const deltaMs = timestamp - lastFrameTime
  lastFrameTime = timestamp

  if (isAnimating.value) {
    const degreesPerMs = (speedRpm.value / 60) * 360 / 1000
    currentAngle.value += degreesPerMs * deltaMs
    currentAngle.value = currentAngle.value % 360
    // 每帧重新渲染 SVG（注入新角度）
    renderSvg()
    animationId = requestAnimationFrame(animate)
  } else {
    animationId = null
  }
}

function toggleAnimation() {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value && animationId === null) {
    lastFrameTime = 0
    animationId = requestAnimationFrame(animate)
  }
}

function resetAll() {
  rotationSpeed.value = 60
  speedUnit.value = 'rpm'
  isCustomSvg.value = false
  customSvgInput.value = ''
  currentAngle.value = 0
  isAnimating.value = true
  svgError.value = ''
  lastFrameTime = 0
  if (animationId === null) {
    animationId = requestAnimationFrame(animate)
  }
  updateSource()
}

watch([customSvgInput, isCustomSvg], () => { updateSource() })

onMounted(() => {
  updateSource()
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="speed-visualizer">
    <div class="tool-content">
      <!-- 转速设置 -->
      <div class="content-card">
        <div class="section-title">转速设置</div>
        <div class="speed-visualizer__controls">
          <div class="speed-visualizer__input-group">
            <label class="section-label">转速值</label>
            <a-input-number v-model:value="rotationSpeed" :min="0" :max="10000" :step="inputStep" style="width: 160px" />
          </div>
          <div class="speed-visualizer__input-group">
            <label class="section-label">单位</label>
            <a-select v-model:value="speedUnit" style="width: 160px">
              <a-select-option value="rpm">RPM（转/分）</a-select-option>
              <a-select-option value="rps">RPS（转/秒）</a-select-option>
              <a-select-option value="rads">rad/s（角速度）</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="speed-visualizer__info">
          <span>实际转速：</span>
          <span class="speed-visualizer__info-value">{{ speedRpm }} RPM = {{ (speedRpm / 60).toFixed(2) }} RPS = {{ ((speedRpm * 2 * Math.PI) / 60).toFixed(2) }} rad/s（角速度）</span>
        </div>
      </div>

      <!-- 自定义 SVG -->
      <div class="content-card">
        <div class="speed-visualizer__toggle-header">
          <div class="section-title" style="margin-bottom: 0">自定义 SVG</div>
          <a-switch v-model:checked="isCustomSvg" />
        </div>
        <div v-if="isCustomSvg" class="speed-visualizer__custom-section">
          <a-textarea v-model:value="customSvgInput" :rows="6" placeholder="粘贴自定义 SVG 代码，图形会围绕中心自动旋转..." />
          <div class="button-container">
            <a-button @click="customSvgInput = ''" :disabled="!customSvgInput">
              <template #icon><ClearOutlined /></template>
              清空
            </a-button>
          </div>
        </div>
      </div>

      <!-- 动画预览 -->
      <div class="content-card">
        <div class="speed-visualizer__preview-header">
          <div class="section-title">动画预览</div>
          <a-button type="link" size="small" @click="toggleAnimation">
            {{ isAnimating ? '暂停' : '播放' }}
          </a-button>
        </div>
        <div class="speed-visualizer__preview">
          <div class="speed-visualizer__wheel-container">
            <img v-if="svgPreviewUrl && !svgError" :src="svgPreviewUrl" alt="Rotating" class="speed-visualizer__wheel" @error="svgSource = ''; svgPreviewUrl = ''; svgError = 'SVG 渲染失败，请检查代码格式是否正确'" />
            <div v-else-if="svgError" class="speed-visualizer__error">{{ svgError }}</div>
            <div v-else class="speed-visualizer__error">请输入 SVG 代码</div>
          </div>
        </div>
        <div class="button-container">
          <a-button @click="resetAll">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </div>
      </div>

      <ToolTips :tips="[
        '支持 RPM（转/分）、RPS（转/秒）和 rad/s（角速度）三种单位切换',
        '默认显示带辐条的轮子，可切换为自定义 SVG 图形旋转展示',
        '可随时暂停/播放动画，观察不同转速下的旋转效果',
        '所有处理在浏览器本地完成，数据不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.speed-visualizer {
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
  margin-top: var(--spacing-md);
}

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

.speed-visualizer__controls {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.speed-visualizer__input-group {
  display: flex;
  flex-direction: column;
}

.speed-visualizer__info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}

.speed-visualizer__info-value {
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.speed-visualizer__toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.speed-visualizer__custom-section {
  margin-top: var(--spacing-md);
}

.speed-visualizer__preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.speed-visualizer__preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.speed-visualizer__wheel-container {
  width: 280px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.speed-visualizer__wheel {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.speed-visualizer__error {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .speed-visualizer__controls {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .speed-visualizer__input-group {
    width: 100%;
  }

  .speed-visualizer__input-group :deep(.ant-input-number),
  .speed-visualizer__input-group :deep(.ant-select) {
    width: 100% !important;
  }

  .speed-visualizer__wheel-container {
    width: 220px;
    height: 220px;
  }
}

@media (max-width: 480px) {
  .speed-visualizer__wheel-container {
    width: 180px;
    height: 180px;
  }
}
</style>
