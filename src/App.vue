<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import HeadBar from "@/components/HeadBar.vue";
import { computed } from "vue";
import { usePageSeo } from "@/utils/seo_utils";
import { StyleProvider } from 'ant-design-vue/es/_util/cssinjs';

dayjs.locale('zh-cn');
const locale = zhCN;

// 初始化页面 SEO
usePageSeo();

const rootRoutes = computed(() => {
  const rootRoute = useRouter().getRoutes().find(route => route.path === '/');
  return rootRoute?.children || [];
});

// Ant Design Vue 主题配置，与设计令牌保持一致
const theme = {
  token: {
    // 主色
    colorPrimary: "#ff9b17",
    colorPrimaryHover: "#ffb84d",
    colorPrimaryActive: "#e68a00",
    
    // 功能色
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorSuccess: "#52c41a",
    colorInfo: "#1890ff",
    
    // 文字色
    colorText: "#262626",
    colorTextSecondary: "#666666",
    colorTextTertiary: "#8c8c8c",
    
    // 边框
    colorBorder: "#d9d9d9",
    colorBorderSecondary: "#f0f0f0",
    
    // 圆角
    borderRadius: 8,
    
    // 字体
    fontSize: 14,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Microsoft YaHei', sans-serif"
  }
}
</script>

<template>
  <a-config-provider :locale="locale" :theme="theme">
    <StyleProvider :ssr="true">
      <a-app class="full-size">
        <a-layout class="full-size">
          <a-layout-header class="app-header">
            <head-bar :routes="rootRoutes"/>
          </a-layout-header>
          <a-layout class="app-content">
            <router-view/>
          </a-layout>
        </a-layout>
      </a-app>
    </StyleProvider>
  </a-config-provider>
</template>

<style scoped>
.app-header {
  background-color: var(--color-bg-component);
  border-bottom: 1px solid var(--color-border-light);
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-content {
  background-color: var(--color-bg);
  min-height: calc(100vh - 64px);
}
</style>
