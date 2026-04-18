<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'

const isSimulationMode = ref(true)
const currentValue = ref(1)
const maxFacesInput = ref('6')
const isRolling = ref(false)
const rollKey = ref(0)
const history = ref<Array<{ value: number; time: string }>>([])
let shuffleTimer: ReturnType<typeof setInterval> | null = null

const validatedMaxFaces = computed(() => {
  const n = parseInt(maxFacesInput.value, 10)
  if (isNaN(n) || n < 1) return 1
  return n
})

function rollDice() {
  const max = isSimulationMode.value ? 6 : validatedMaxFaces.value
  if (max < 1) return
  isRolling.value = true

  // 快速随机切换面值，模拟摇骰子
  shuffleTimer = setInterval(() => {
    currentValue.value = Math.floor(Math.random() * max) + 1
  }, 60)

  // 500ms 后停止，显示最终结果
  setTimeout(() => {
    if (shuffleTimer) {
      clearInterval(shuffleTimer)
      shuffleTimer = null
    }
    currentValue.value = Math.floor(Math.random() * max) + 1
    rollKey.value++
    isRolling.value = false
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    history.value.unshift({ value: currentValue.value, time })
    if (history.value.length > 20) history.value.pop()
  }, 500)
}

function resetDice() {
  currentValue.value = 1
  maxFacesInput.value = isSimulationMode.value ? '6' : ''
  history.value = []
}

function toggleMode() {
  isSimulationMode.value = !isSimulationMode.value
  currentValue.value = 1
  if (isSimulationMode.value) {
    maxFacesInput.value = '6'
  } else {
    maxFacesInput.value = ''
  }
  history.value = []
}

const diceDots = computed(() => {
  const v = currentValue.value
  if (v < 1 || v > 6) return []
  const positions: Record<number, [number, number][]> = {
    1: [[1, 1]],
    2: [[0, 2], [2, 0]],
    3: [[0, 2], [1, 1], [2, 0]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  }
  return positions[v] || []
})

function onMaxFacesInput() {
  const n = parseInt(maxFacesInput.value, 10)
  if (!isNaN(n) && n >= 1) {
    currentValue.value = n
  }
}

onUnmounted(() => {
  if (shuffleTimer) {
    clearInterval(shuffleTimer)
  }
})
</script>

<template>
  <div>
    <!-- Mode Toggle -->
    <div class="dice-tool__mode-toggle">
      <a-button :type="isSimulationMode ? 'primary' : 'default'" @click="!isSimulationMode && toggleMode()">
        仿真模式
      </a-button>
      <a-button :type="!isSimulationMode ? 'primary' : 'default'" @click="isSimulationMode && toggleMode()">
        数字模式
      </a-button>
    </div>

    <!-- Max Faces Input -->
    <div v-if="!isSimulationMode" class="dice-tool__config">
      <label class="dice-tool__label">面数上限</label>
      <a-input-number
        v-model:value="maxFacesInput"
        :min="1"
        placeholder="输入正整数"
        class="dice-tool__input"
        @change="onMaxFacesInput"
      />
    </div>

    <!-- Dice Display -->
    <div class="dice-tool__display">
      <div
        :class="['dice-tool__dice', { 'dice-tool__dice--rolling': isRolling }]"
        v-if="isSimulationMode"
      >
        <div
          v-for="(pos, i) in diceDots"
          :key="i"
          class="dice-tool__dot"
          :style="{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }"
        />
      </div>
      <Transition name="dice-settle" mode="out-in" v-else>
        <div class="dice-tool__number" :key="rollKey">
          {{ currentValue }}
        </div>
      </Transition>
      <div v-if="!isSimulationMode && validatedMaxFaces > 1" class="dice-tool__range">
        1 ~ {{ validatedMaxFaces }}
      </div>
      <div v-else-if="isSimulationMode" class="dice-tool__range">
        1 ~ 6
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="dice-tool__button-group">
      <a-button type="primary" @click="rollDice" :disabled="isRolling || (!isSimulationMode && !maxFacesInput)">
        掷骰子
      </a-button>
      <a-button @click="resetDice">
        <template #icon><ReloadOutlined /></template>
        重置
      </a-button>
    </div>

    <!-- History -->
    <div v-if="history.length > 0" class="dice-tool__history">
      <div class="dice-tool__history-header">投掷记录</div>
      <div v-for="(record, index) in history" :key="index" class="dice-tool__history-item">
        <span class="dice-tool__history-index">#{{ history.length - index }}</span>
        <span class="dice-tool__history-value">{{ record.value }}</span>
        <span class="dice-tool__history-time">{{ record.time }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-tool__mode-toggle {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}

.dice-tool__config {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.dice-tool__label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.dice-tool__input {
  width: 160px;
}

.dice-tool__display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.dice-tool__dice {
  width: 120px;
  height: 120px;
  background: var(--color-bg-component);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px var(--color-shadow);
  transition: transform 0.15s ease;
}

.dice-tool__dice--rolling {
  animation: dice-shake 0.12s ease-in-out infinite alternate;
}

@keyframes dice-shake {
  0% { transform: rotate(-8deg) scale(1.05); }
  25% { transform: rotate(6deg) scale(1.02); }
  50% { transform: rotate(-4deg) scale(1.06); }
  75% { transform: rotate(8deg) scale(1.01); }
  100% { transform: rotate(-6deg) scale(1.04); }
}

.dice-tool__dot {
  width: 18px;
  height: 18px;
  background: var(--color-text-title);
  border-radius: 50%;
  align-self: center;
  justify-self: center;
}

.dice-tool__number {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tool-display);
  border-radius: 16px;
  font-size: 48px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.dice-tool__range {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.dice-tool__button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.dice-tool__history {
  margin-top: 24px;
  border-top: 1px solid var(--color-border-light);
  padding-top: 16px;
}

.dice-tool__history-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.dice-tool__history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 8px;
  background: var(--color-bg);
  border-radius: 6px;
}

.dice-tool__history-index {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 40px;
}

.dice-tool__history-value {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dice-tool__history-time {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* Settle transition for number mode */
.dice-settle-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dice-settle-leave-active {
  transition: all 0.15s ease-in;
}

.dice-settle-enter-from {
  opacity: 0;
  transform: scale(0.6) rotateY(90deg);
}

.dice-settle-leave-to {
  opacity: 0;
  transform: scale(0.85) rotateY(-45deg);
}
</style>
