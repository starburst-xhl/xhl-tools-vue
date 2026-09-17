<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ToolTips from '@/components/ToolTips.vue'

// ── 计算目标：时间 / 容量 / 速度，目标字段由另外两个字段自动算出 ──
type Target = 'time' | 'size' | 'speed'
type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'
type SpeedUnit = 'bps' | 'Kbps' | 'Mbps' | 'Gbps' | 'B/s' | 'KB/s' | 'MB/s' | 'GB/s'

const target = ref<Target>('time')
const isTimeTarget = computed(() => target.value === 'time')
const isSizeTarget = computed(() => target.value === 'size')
const isSpeedTarget = computed(() => target.value === 'speed')

// ── 单位换算表：容量以字节为基准，速度以比特/秒为基准 ──
const SIZE_UNITS: Record<SizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
}

const SPEED_UNITS: Record<SpeedUnit, number> = {
  bps: 1,
  Kbps: 1e3,
  Mbps: 1e6,
  Gbps: 1e9,
  'B/s': 8,
  'KB/s': 8 * 1024,
  'MB/s': 8 * 1024 ** 2,
  'GB/s': 8 * 1024 ** 3,
}

// ── 输入值 ──
const sizeValue = ref(1)
const sizeUnit = ref<SizeUnit>('GB')
const speedValue = ref(100)
const speedUnit = ref<SpeedUnit>('Mbps')
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

// ── 统一换算到基准单位 ──
const inputSizeBytes = computed(() => (sizeValue.value || 0) * SIZE_UNITS[sizeUnit.value])
const inputSpeedBps = computed(() => (speedValue.value || 0) * SPEED_UNITS[speedUnit.value])
const inputSeconds = computed(() => (hours.value || 0) * 3600 + (minutes.value || 0) * 60 + (seconds.value || 0))

// ── 三个参数的值（目标字段由另外两个算出）──
const timeSeconds = computed(() => {
  if (!isTimeTarget.value) return inputSeconds.value
  const bps = inputSpeedBps.value
  return bps > 0 ? (inputSizeBytes.value * 8) / bps : 0
})

const sizeBytes = computed(() => {
  if (!isSizeTarget.value) return inputSizeBytes.value
  const sec = inputSeconds.value
  return sec > 0 ? (inputSpeedBps.value * sec) / 8 : 0
})

const speedBps = computed(() => {
  if (!isSpeedTarget.value) return inputSpeedBps.value
  const sec = inputSeconds.value
  return sec > 0 ? (inputSizeBytes.value * 8) / sec : 0
})

// ── 数值格式化 ──
function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value) || value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 1e15 || abs < 1e-6) return value.toExponential(2)
  if (abs >= 1000) return String(Math.round(value))
  return String(roundTo(value, digits))
}

// ── 目标字段的展示值 ──
const sizeDisplay = computed({
  get: () => (isSizeTarget.value ? roundTo(sizeBytes.value / SIZE_UNITS[sizeUnit.value], 4) : sizeValue.value),
  set: (val: number | null) => { sizeValue.value = val ?? 0 },
})

const speedDisplay = computed({
  get: () => (isSpeedTarget.value ? roundTo(speedBps.value / SPEED_UNITS[speedUnit.value], 4) : speedValue.value),
  set: (val: number | null) => { speedValue.value = val ?? 0 },
})

const timeParts = computed(() => {
  const total = Math.max(0, timeSeconds.value)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return { h, m, s: total - h * 3600 - m * 60 }
})

// ── 结果 ──
const hasResult = computed(() => {
  if (isTimeTarget.value) return inputSpeedBps.value > 0
  if (isSizeTarget.value) return inputSpeedBps.value > 0 && inputSeconds.value > 0
  return inputSizeBytes.value > 0 && inputSeconds.value > 0
})

const resultMain = computed(() => {
  if (!hasResult.value) return '—'
  if (isTimeTarget.value) {
    const { h, m, s } = timeParts.value
    const parts: string[] = []
    if (h > 0) parts.push(`${h} 小时`)
    if (h > 0 || m > 0) parts.push(`${m} 分钟`)
    parts.push(`${formatNumber(s, 2)} 秒`)
    return parts.join(' ')
  }
  if (isSizeTarget.value) return `${formatNumber(sizeBytes.value / SIZE_UNITS[sizeUnit.value], 2)} ${sizeUnit.value}`
  return `${formatNumber(speedBps.value / SPEED_UNITS[speedUnit.value], 2)} ${speedUnit.value}`
})

const resultSub = computed(() => {
  if (!hasResult.value) return '请填写完整的参数后查看结果'
  if (isTimeTarget.value) {
    const total = timeSeconds.value
    return total >= 60
      ? `共 ${formatNumber(total, 2)} 秒，约 ${formatNumber(total / 60, 1)} 分钟`
      : `共 ${formatNumber(total, 2)} 秒`
  }
  if (isSizeTarget.value) return `共 ${formatNumber(sizeBytes.value, 0)} 字节`
  const bps = speedBps.value
  return speedUnit.value.includes('/')
    ? `≈ ${formatNumber(bps / 1e6, 2)} Mbps（兆比特/秒）`
    : `≈ ${formatNumber(bps / (8 * 1024 ** 2), 2)} MB/s（兆字节/秒）`
})

// ── 切换单位时换算数值，保持实际大小 / 速度不变 ──
watch(sizeUnit, (newUnit, oldUnit) => {
  if (isSizeTarget.value || !sizeValue.value) return
  sizeValue.value = roundTo((sizeValue.value * SIZE_UNITS[oldUnit]) / SIZE_UNITS[newUnit], 4)
})

watch(speedUnit, (newUnit, oldUnit) => {
  if (isSpeedTarget.value || !speedValue.value) return
  speedValue.value = roundTo((speedValue.value * SPEED_UNITS[oldUnit]) / SPEED_UNITS[newUnit], 4)
})

// ── 切换计算目标时，把上一次算出的结果回填为输入值 ──
function setTarget(next: Target) {
  if (next === target.value) return
  if (hasResult.value) {
    if (isSizeTarget.value) {
      sizeValue.value = roundTo(sizeBytes.value / SIZE_UNITS[sizeUnit.value], 4)
    } else if (isSpeedTarget.value) {
      speedValue.value = roundTo(speedBps.value / SPEED_UNITS[speedUnit.value], 4)
    } else {
      const { h, m, s } = timeParts.value
      hours.value = h
      minutes.value = m
      seconds.value = roundTo(s, 2)
    }
  }
  target.value = next
}

function handleTargetChange(e: { target: { value: unknown } }) {
  setTarget(e.target.value as Target)
}
</script>

<template>
  <div class="download-calculator">
    <div class="tool-content">
      <!-- 计算目标 -->
      <div>
        <label class="section-label">计算目标</label>
        <a-radio-group :value="target" button-style="solid" @change="handleTargetChange">
          <a-radio-button value="time">下载时间</a-radio-button>
          <a-radio-button value="size">文件容量</a-radio-button>
          <a-radio-button value="speed">下载速度</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 参数输入 -->
      <div class="content-card">
        <div class="section-title">参数设置</div>

        <div class="download-calculator__field">
          <label class="section-label">
            文件容量
            <span v-if="isSizeTarget" class="download-calculator__auto-tag">自动计算</span>
          </label>
          <div class="download-calculator__input-row">
            <a-input-number v-model:value="sizeDisplay" :disabled="isSizeTarget" :min="0" :step="1" style="width: 180px" />
            <a-select v-model:value="sizeUnit" style="width: 140px">
              <a-select-option value="B">B（字节）</a-select-option>
              <a-select-option value="KB">KB（千字节）</a-select-option>
              <a-select-option value="MB">MB（兆字节）</a-select-option>
              <a-select-option value="GB">GB（吉字节）</a-select-option>
              <a-select-option value="TB">TB（太字节）</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="download-calculator__field">
          <label class="section-label">
            下载速度
            <span v-if="isSpeedTarget" class="download-calculator__auto-tag">自动计算</span>
          </label>
          <div class="download-calculator__input-row">
            <a-input-number v-model:value="speedDisplay" :disabled="isSpeedTarget" :min="0" :step="1" style="width: 180px" />
            <a-select v-model:value="speedUnit" style="width: 200px">
              <a-select-opt-group label="比特单位（带宽）">
                <a-select-option value="bps">bps（比特/秒）</a-select-option>
                <a-select-option value="Kbps">Kbps（千比特/秒）</a-select-option>
                <a-select-option value="Mbps">Mbps（兆比特/秒）</a-select-option>
                <a-select-option value="Gbps">Gbps（吉比特/秒）</a-select-option>
              </a-select-opt-group>
              <a-select-opt-group label="字节单位（下载工具）">
                <a-select-option value="B/s">B/s（字节/秒）</a-select-option>
                <a-select-option value="KB/s">KB/s（千字节/秒）</a-select-option>
                <a-select-option value="MB/s">MB/s（兆字节/秒）</a-select-option>
                <a-select-option value="GB/s">GB/s（吉字节/秒）</a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
        </div>

        <div class="download-calculator__field">
          <label class="section-label">
            下载时间
            <span v-if="isTimeTarget" class="download-calculator__auto-tag">自动计算</span>
          </label>
          <div v-if="isTimeTarget" class="download-calculator__time-result">
            <span class="download-calculator__time-value">{{ timeParts.h }}</span>
            <span class="download-calculator__time-unit">时</span>
            <span class="download-calculator__time-value">{{ timeParts.m }}</span>
            <span class="download-calculator__time-unit">分</span>
            <span class="download-calculator__time-value">{{ formatNumber(timeParts.s, 2) }}</span>
            <span class="download-calculator__time-unit">秒</span>
          </div>
          <div v-else class="download-calculator__input-row">
            <a-input-number v-model:value="hours" :min="0" :precision="0" style="width: 96px" />
            <span class="download-calculator__unit-text">时</span>
            <a-input-number v-model:value="minutes" :min="0" :precision="0" style="width: 96px" />
            <span class="download-calculator__unit-text">分</span>
            <a-input-number v-model:value="seconds" :min="0" :precision="0" style="width: 96px" />
            <span class="download-calculator__unit-text">秒</span>
          </div>
        </div>
      </div>

      <!-- 计算结果 -->
      <div class="content-card">
        <div class="section-title">计算结果</div>
        <div class="download-calculator__result">
          <div class="download-calculator__result-main">{{ resultMain }}</div>
          <div class="download-calculator__result-sub">{{ resultSub }}</div>
        </div>
      </div>

      <ToolTips :tips="[
        '输入任意两个参数，第三个参数自动计算，可自由切换计算目标',
        '时间支持时、分、秒三段输入，容量和速度支持单位切换',
        '切换单位时数值自动换算，始终保持实际大小或速度不变',
        '容量按 1 KB = 1024 B 换算，网络带宽按 1 Mbps = 1000 Kbps 换算',
        '所有计算在浏览器本地完成，数据不会上传到服务器',
      ]" />
    </div>
  </div>
</template>

<style scoped>
.download-calculator {
  width: 100%;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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

.download-calculator__field + .download-calculator__field {
  margin-top: var(--spacing-lg);
}

.download-calculator__input-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.download-calculator__unit-text {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.download-calculator__auto-tag {
  display: inline-block;
  margin-left: var(--spacing-xs);
  padding: 0 var(--spacing-xs);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-sm);
}

.download-calculator__time-result {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.download-calculator__time-value {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.download-calculator__time-unit {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin-right: var(--spacing-sm);
}

.download-calculator__result {
  padding: var(--spacing-lg);
  background: var(--color-bg-tool-display);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  text-align: center;
}

.download-calculator__result-main {
  font-size: 28px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.download-calculator__result-sub {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .download-calculator__input-row :deep(.ant-input-number),
  .download-calculator__input-row :deep(.ant-select) {
    width: 100% !important;
  }

  .download-calculator__unit-text {
    margin-right: 0;
  }

  .download-calculator__result-main {
    font-size: 22px;
  }
}
</style>
