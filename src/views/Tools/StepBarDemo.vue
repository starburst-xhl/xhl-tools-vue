<template>
  <div class="step-bar-container">
    <div class="step-bar">
      <div class="progress" style="width: calc(100% - 40px); background-color: grey"></div>
      <div class="progress" :style="{
        width: 'calc(' + ((currentStep / (steps.length - 1)) * 100).toFixed(2) + '%' + ' - '
        + ((currentStep / (steps.length - 1)) * 40).toFixed(2) + 'px)',
        backgroundColor: 'blue'
      }"></div>
      <div v-for="(step, index) in steps" :key="index" class="step" :class="{ active: index <= currentStep }">
        <div class="circle"></div>
        <span>{{ step }}</span>
      </div>
    </div>
    <div class="flex-center step-bar-demo-button-container">
      <a-button @click="handlePrev" :disabled="currentStep === 0">Previous</a-button>
      <a-button @click="handleNext" :disabled="currentStep === steps.length - 1">Next</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const steps = ['Step 1', 'Step 2', 'Step 3'];
const currentStep = ref(0);

const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const handlePrev = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};
</script>

<style scoped>
.step-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.step-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 600px;
  height: 50px;
}

.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: gray;
  width: 40px;
}

.circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: gray;
  transition: all 0s;
}

.step.active .circle {
  animation: activateCircle 0.2s forwards;
  animation-delay: 0.3s;
}

.step.active span {
  color: blue;
  transition: all 0.5s ease-in-out;
}

.progress {
  position: absolute;
  top: 7px;
  left: 0;
  height: 2px;
  background-color: gray;
  margin-left: 20px;
  transition: all 0.3s ease-in-out;
}

.step:not(:first-child) .progress {
  width: calc(100% / 2 - 8px); /* Adjust based on the number of steps */
}

.step-bar-demo-button-container {
  margin-top: 50px;
  gap: 20px;
  width: 100%;
}

@keyframes activateCircle {
  0% {
    transform: scale(1);
    background-color: gray;
    animation-timing-function: ease-in-out;
  }
  20% {
    transform: scale(0.8);
    background-color: blue;
  }
  85%, 100% {
    background-color: blue;
    animation-timing-function: ease-in-out;
  }
  85% {
    transform: scale(1.4); /* 增大到190% */
    animation-timing-function: ease-in-out;
  }
  100% {
    transform: scale(1.3); /* 缩小到160% */
    animation-timing-function: ease-in-out;
  }
}
</style>
