<script setup lang="ts">
import { ToolOutlined, RocketOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { GithubOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const goToTools = () => {
  router.push({ name: 'tools' });
};
</script>

<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-badge">
        <ToolOutlined class="badge-icon" />
        <span>开源工具集合</span>
      </div>
      
      <h1 class="hero-title">
        XHL Tools - 高效便捷的<br>
        <span class="highlight">在线工具箱</span>
      </h1>
      
      <p class="hero-description">
        提供编解码、加密解密、数字工具、媒体处理等多种实用工具，
        无需安装，即开即用，助你提升工作效率
      </p>
      
      <div class="hero-actions">
        <a-button 
          type="primary" 
          size="large" 
          class="hero-btn hero-btn--primary"
          @click="goToTools"
        >
          <template #icon>
            <RocketOutlined />
          </template>
          立即开始
        </a-button>
        
        <a-button 
          size="large" 
          class="hero-btn hero-btn--secondary"
          href="https://github.com/starburst-xhl/xhl-tools-vue" 
          target="_blank"
        >
          <template #icon>
            <GithubOutlined />
          </template>
          GitHub
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, var(--color-bg-component) 100%);
  padding: var(--spacing-xxxxxl) var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 155, 23, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-component);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-xxl);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-body);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
}

.badge-icon {
  font-size: 18px;
}

.hero-title {
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-xl);
  line-height: var(--line-height-heading);
}

.highlight {
  color: var(--color-primary);
  position: relative;
}

.hero-description {
  font-size: var(--font-size-h4);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
  margin-bottom: var(--spacing-xxxl);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  height: 48px;
  padding: 0 var(--spacing-xl);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.hero-btn :deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero-btn--primary {
  box-shadow: 0 4px 16px rgba(255, 155, 23, 0.3);
}

.hero-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 155, 23, 0.4);
}

.hero-btn--secondary {
  background: var(--color-bg-component);
  border: 1px solid var(--color-border);
}

.hero-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    height: 100vh;
    padding: var(--spacing-xxxxl) var(--spacing-md);
  }
  
  .hero-title {
    font-size: var(--font-size-h1);
  }
  
  .hero-description {
    font-size: var(--font-size-body);
  }
  
  .hero-badge {
    font-size: var(--font-size-caption);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
