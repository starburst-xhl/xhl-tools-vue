<script setup lang="ts">
import { GithubOutlined, ApiOutlined, CodeOutlined, CloudOutlined } from '@ant-design/icons-vue';

const techStack = [
  { icon: CodeOutlined, name: 'Vue 3', description: '渐进式 JavaScript 框架' },
  { icon: ApiOutlined, name: 'TypeScript', description: '类型安全的 JavaScript 超集' },
  { icon: CloudOutlined, name: 'Vite SSG', description: '静态站点生成器' },
  { icon: CloudOutlined, name: 'Ant Design Vue', description: '企业级 UI 组件库' }
];
</script>

<template>
  <div class="about-section">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">关于项目</h2>
        <p class="section-description">开源免费，持续演进</p>
      </div>
      
      <a-row :gutter="[48, 48]" align="middle">
        <a-col :xs="24" :lg="14">
          <div class="about-content">
            <h3 class="about-title">为什么开发 XHL Tools？</h3>
            <p class="about-text">
              在日常开发和工作中，我们经常需要使用各种小工具，比如编解码、加密解密、格式转换等。
              这些工具虽然简单，但经常需要在不同网站之间切换，不仅效率低下，还可能存在隐私泄露的风险。
            </p>
            <p class="about-text">
              因此，我开发了 XHL Tools 在线工具箱，将常用的工具集中在一起。
              所有工具都在浏览器本地运行，数据不会上传到服务器，
              既保证了效率，又保护了您的隐私安全。
            </p>
            <div class="about-actions">
              <a-button 
                type="primary" 
                size="large"
                href="https://github.com/starburst-xhl/xhl-tools-vue" 
                target="_blank"
                rel="noopener noreferrer"
                class="github-btn"
              >
                <template #icon>
                  <GithubOutlined />
                </template>
                访问 GitHub
              </a-button>
            </div>
          </div>
        </a-col>
        
        <a-col :xs="24" :lg="10">
          <div class="tech-stack">
            <h4 class="tech-title">技术栈</h4>
            <div class="tech-list">
              <div 
                class="tech-item" 
                v-for="tech in techStack" 
                :key="tech.name"
              >
                <div class="tech-icon">
                  <component :is="tech.icon" />
                </div>
                <div class="tech-info">
                  <div class="tech-name">{{ tech.name }}</div>
                  <div class="tech-description">{{ tech.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.about-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-component);
  padding: var(--spacing-xxxxxl) var(--spacing-lg);
  overflow-y: auto;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-xxxxl);
}

.section-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-md);
}

.section-description {
  font-size: var(--font-size-h4);
  color: var(--color-text-secondary);
}

.about-content {
  padding-right: var(--spacing-lg);
}

.about-title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-lg);
}

.about-text {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
  margin-bottom: var(--spacing-md);
}

.about-actions {
  margin-top: var(--spacing-xl);
}

.github-btn {
  height: 48px;
  padding: 0 var(--spacing-xl);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px rgba(255, 155, 23, 0.3);
  transition: var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.github-btn :deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.github-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 155, 23, 0.4);
}

.tech-stack {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.tech-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-lg);
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tech-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-component);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  border: 1px solid var(--color-border-light);
}

.tech-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.tech-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-md);
  font-size: 24px;
  color: var(--color-bg-component);
  flex-shrink: 0;
}

.tech-info {
  flex: 1;
}

.tech-name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
  margin-bottom: var(--spacing-xs);
}

.tech-description {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-tertiary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-section {
    padding: var(--spacing-xxxxl) var(--spacing-md);
  }
  
  .section-title {
    font-size: var(--font-size-h2);
  }
  
  .section-description {
    font-size: var(--font-size-body);
  }
  
  .about-content {
    padding-right: 0;
    margin-bottom: var(--spacing-xl);
  }
  
  .about-title {
    font-size: var(--font-size-h4);
  }
  
  .tech-stack {
    padding: var(--spacing-lg);
  }
}
</style>
