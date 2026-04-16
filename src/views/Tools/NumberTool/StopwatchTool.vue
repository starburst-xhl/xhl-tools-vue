<script setup lang="ts">
import {onUnmounted, ref} from "vue";

const startTime = ref<number | null>(null);
const elapsedTime = ref<number>(0);
let timerId: number | null = null;
const isRunning = ref<boolean>(false);
const lapRecords = ref<Array<{ time: number; display: string }>>([]);

const startStopwatch = () => {
  if (!startTime.value) {
    startTime.value = Date.now();
  }
  timerId = window.setInterval(() => {
    if (startTime.value !== null) {
      elapsedTime.value = Date.now() - startTime.value;
    }
  }, 10);
  isRunning.value = true;
};

const stopStopwatch = () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    startTime.value = null;
    isRunning.value = false;
  }
};

const resetStopwatch = () => {
  stopStopwatch();
  elapsedTime.value = 0;
  lapRecords.value = [];
};

const lapStopwatch = () => {
  if (isRunning.value) {
    lapRecords.value.push({
      time: elapsedTime.value,
      display: formatTime(elapsedTime.value)
    });
  }
};

const formatTime = (time: number): string => {
  const totalSeconds = Math.floor(time / 1000);
  const milliseconds = String((time % 1000)).padStart(3, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');

  return `${minutes}:${seconds}.${milliseconds}`;
};

const formattedTime = ref<string>('00:00.000');

setInterval(() => {
  formattedTime.value = formatTime(elapsedTime.value);
}, 10);

onUnmounted(() => {
  if (timerId !== null) {
    clearInterval(timerId);
  }
});
</script>

<template>
  <div>
    <div class="timer-tool__time-container">
      <p class="timer-tool__time">{{ formattedTime }}</p>
    </div>
    <div class="timer-tool__button-group">
      <a-button @mousedown="startStopwatch" type="primary" v-show="!isRunning">启动</a-button>
      <a-button @mousedown="stopStopwatch" type="primary" v-show="isRunning">停止</a-button>
      <a-button @mousedown="lapStopwatch" :disabled="!isRunning">掐表</a-button>
      <a-button @click="resetStopwatch">重置</a-button>
    </div>
    <div v-if="lapRecords.length > 0" class="timer-tool__lap-list">
      <div class="timer-tool__lap-header">掐表记录</div>
      <div v-for="(record, index) in lapRecords.slice().reverse()" :key="index" class="timer-tool__lap-item">
        <span class="timer-tool__lap-index">#{{ lapRecords.length - index }}</span>
        <span class="timer-tool__lap-time">{{ record.display }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-tool__time-container {
  background-color: var(--color-bg-tool-display);
  padding: 32px;
  border-radius: 8px;
}

.timer-tool__time {
  font-size: 48px;
  text-align: center;
  margin: 0;
  color: #ff9b17;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.timer-tool__button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.timer-tool__lap-list {
  margin-top: 24px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.timer-tool__lap-header {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.timer-tool__lap-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #fafafa;
  border-radius: 6px;
}

.timer-tool__lap-index {
  font-weight: 600;
  color: #ff9b17;
}

.timer-tool__lap-time {
  font-family: 'Courier New', monospace;
  color: #595959;
}
</style>
