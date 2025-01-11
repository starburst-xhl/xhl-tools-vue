<script setup lang="ts">
import {onUnmounted, ref} from "vue";

const startTime = ref<number | null>(null);
const elapsedTime = ref<number>(0);
let timerId: number | null = null;
const isRunning = ref<boolean>(false);

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
      <a-button @click="startStopwatch" type="primary" v-show="!isRunning">启动</a-button>
      <a-button @click="stopStopwatch" type="primary" v-show="isRunning">停止</a-button>
      <a-button @click="resetStopwatch">重置</a-button>
    </div>
  </div>
</template>

<style scoped>
.timer-tool__time-container {
  border: 1px solid #d9d9d9;
  padding: 32px;
}

.timer-tool__time {
  font-size: 48px;
  text-align: center;
  margin: 0;
}

.timer-tool__button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
</style>
