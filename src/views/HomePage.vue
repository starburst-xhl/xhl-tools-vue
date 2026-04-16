<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import HeroSection from '@/components/home/HeroSection.vue';
import AboutSection from '@/components/home/AboutSection.vue';

const currentSlide = ref(0);
const isScrolling = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const totalSlides = 2; // Hero 和 About 两个幻灯片

const scrollToSlide = (index: number) => {
  if (isScrolling.value || index < 0 || index >= totalSlides) return;
  
  isScrolling.value = true;
  currentSlide.value = index;
  
  // 平滑滚动到指定幻灯片
  if (containerRef.value) {
    const slideHeight = window.innerHeight;
    containerRef.value.style.transform = `translateY(-${index * slideHeight}px)`;
  }
  
  // 防抖，避免快速滚动
  setTimeout(() => {
    isScrolling.value = false;
  }, 800);
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  
  if (isScrolling.value) return;
  
  if (e.deltaY > 0) {
    // 向下滚动
    scrollToSlide(currentSlide.value + 1);
  } else {
    // 向上滚动
    scrollToSlide(currentSlide.value - 1);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    scrollToSlide(currentSlide.value + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    scrollToSlide(currentSlide.value - 1);
  }
};

onMounted(() => {
  // 添加滚轮事件监听
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="home-page">
    <!-- 幻灯片容器 -->
    <div ref="containerRef" class="slides-container">
      <div class="slide">
        <hero-section />
      </div>
      <div class="slide">
        <about-section />
      </div>
    </div>
    
    <!-- 导航指示器 -->
    <div class="slide-nav">
      <button
        v-for="i in totalSlides"
        :key="i"
        class="nav-dot"
        :class="{ active: currentSlide === i - 1 }"
        @click="scrollToSlide(i - 1)"
        :aria-label="`跳转到第 ${i} 页`"
      />
    </div>
    
    <!-- 滚动提示 -->
    <transition name="fade">
      <div v-if="currentSlide === 0" class="scroll-hint">
        <span>向下滚动</span>
        <div class="scroll-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 16l-6-6h12z" />
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: var(--color-bg);
}

.slides-container {
  width: 100%;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000);
  will-change: transform;
}

.slide {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.slide > * {
  width: 100%;
  height: 100%;
}

/* 导航指示器 */
.slide-nav {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-border);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.nav-dot:hover {
  background: var(--color-primary-light);
  transform: scale(1.2);
}

.nav-dot.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(255, 155, 23, 0.5);
}

/* 滚动提示 */
.scroll-hint {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  animation: bounce 2s infinite;
  z-index: 100;
}

.scroll-icon {
  opacity: 0.6;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .slide-nav {
    right: 16px;
  }
  
  .nav-dot {
    width: 10px;
    height: 10px;
  }
  
  .scroll-hint {
    bottom: 24px;
  }
}
</style>
