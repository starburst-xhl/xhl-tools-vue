<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MenuItemType } from "ant-design-vue/es/menu/src/interface";
import { routeToMenuItems } from "@/utils/menu_utils.ts";
import { getIconComponent } from "@/utils/tool_utils";
import { MenuUnfoldOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

const selectedKeys = ref<string[]>([]);
const openKeys = ref([]) as any;
const items = ref<MenuItemType[]>([]);
const collapsed = ref(false);
const isMobile = ref(false);

// 当前路由的 meta 信息
const currentMeta = computed(() => route.meta);
const currentIcon = computed(() => 
  currentMeta.value?.icon ? getIconComponent(currentMeta.value.icon as string) : null
);

function initItems() {
  // 获取当前匹配的路由记录
  const matchedRecords = useRoute().matched;
  // 如果有至少两个层级，则获取二级路由
  const currentSecondLevelRoute = matchedRecords.length > 1 ? matchedRecords[1] : null;
  if (currentSecondLevelRoute) {
    items.value = routeToMenuItems(currentSecondLevelRoute.children);
    const lastName = matchedRecords[matchedRecords.length - 1].name;
    if (typeof lastName === 'string') {
      selectedKeys.value.push(lastName);
    }
  }
}

function handleMenuClick(params: { key: string }) {
  router.push({ name: params.key });
  // 移动端点击菜单后自动收起
  if (isMobile.value) {
    collapsed.value = true;
  }
}

// 点击来源标签
function handleSourceClick() {
  if (currentMeta.value?.source && (currentMeta.value.source as any).url) {
    window.open((currentMeta.value.source as any).url, '_blank', 'noopener,noreferrer');
  }
}

// 检测是否为移动端
function checkMobile() {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    collapsed.value = true;
  } else {
    collapsed.value = false;
  }
}

// 切换侧边栏
function toggleSidebar() {
  collapsed.value = !collapsed.value;
}

onMounted(() => {
  initItems();
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
</script>

<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="240"
    :collapsed-width="0"
    class="side-menu"
    :class="{ 'side-menu--collapsed': collapsed }"
  >
    <div class="side-menu__wrapper">
      <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :items="items"
        @click="handleMenuClick"
        class="side-menu__navigation"
      />
    </div>
  </a-layout-sider>

  <a-layout class="main-layout">
    <!-- 菜单切换按钮 - 在菜单收起时显示 -->
    <div v-if="collapsed" class="menu-toggle" @click="toggleSidebar">
      <MenuUnfoldOutlined />
    </div>

    <a-layout-content class="main-content">
      <!-- 固定标题区 -->
      <div class="page-header">
        <div class="page-header__title-row">
          <component
            v-if="currentIcon"
            :is="currentIcon"
            class="page-header__icon"
          />
          <h2 class="page-header__title">{{ currentMeta?.title }}</h2>
        </div>

        <p v-if="currentMeta?.description" class="page-header__description">
          {{ currentMeta.description }}
        </p>

        <a-tag
          v-if="currentMeta?.source"
          color="orange"
          class="page-header__source"
          @click="handleSourceClick"
        >
          来源：{{ (currentMeta.source as any).name }}
        </a-tag>
      </div>

      <!-- 可滚动内容区 -->
      <div class="page-content">
        <router-view />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.side-menu {
  background: var(--color-bg-component);
  border-right: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all 0.2s;
}

.side-menu--collapsed {
  border-right: none;
}

.side-menu__wrapper {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
}

.side-menu__navigation {
  border-right: none;
  height: 100%;
}

.main-layout {
  background-color: var(--color-bg);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-toggle {
  position: fixed;
  top: 72px;
  left: var(--spacing-md);
  z-index: 99;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-component);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: var(--transition-fast);
}

.menu-toggle:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--spacing-lg);
}

/* 页面标题区 - 固定 */
.page-header {
  width: calc(100% - var(--spacing-md));
  max-width: 800px;
  margin: 0 auto var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.page-header__title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.page-header__icon {
  font-size: 28px;
  color: var(--color-primary);
}

.page-header__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--color-text-title);
}

.page-header__description {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-body);
}

.page-header__source {
  cursor: pointer;
  transition: var(--transition-fast);
}

.page-header__source:hover {
  opacity: 0.8;
}

/* 页面内容区 */
.page-content {
  width: calc(100% - var(--spacing-md));
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  flex-shrink: 0;
  max-height: calc(100vh - 64px - 220px);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.page-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
