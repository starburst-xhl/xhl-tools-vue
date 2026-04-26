<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { getIconComponent } from "@/utils/tool_utils";
import { MenuUnfoldOutlined } from '@ant-design/icons-vue';
import MenuItems from './MenuItems.vue';
import type { ExtendedRouteMeta } from '@/utils/tool_utils';

const route = useRoute();

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const menuRoutes = ref<RouteRecordRaw[]>([]);
const collapsed = ref(false);
const isMobile = ref(false);
const isHydrated = ref(false);
const pageContentRef = ref<HTMLElement | null>(null);

// 侧边栏宽度：折叠时为 0，展开时为 240px
const siderWidth = computed(() => collapsed.value ? '0px' : '240px');

// 当前路由的 meta 信息
const currentMeta = computed(() => route.meta);
const currentIcon = computed(() =>
  currentMeta.value?.icon ? getIconComponent(currentMeta.value.icon as string) : null
);

function initItems() {
  const matchedRecords = route.matched;
  const currentSecondLevelRoute = matchedRecords.length > 1 ? matchedRecords[1] : null;
  if (currentSecondLevelRoute && currentSecondLevelRoute.children) {
    menuRoutes.value = currentSecondLevelRoute.children;
    updateSelectedKeys();
    updateOpenKeys();
  }
}

function updateSelectedKeys() {
  const matchedRecords = route.matched;
  const lastName = matchedRecords[matchedRecords.length - 1].name;
  if (typeof lastName === 'string') {
    selectedKeys.value = [lastName];
  }
}

function updateOpenKeys() {
  const matchedRecords = route.matched;
  const parentNames = matchedRecords
    .slice(0, -1)
    .filter(r => r.children?.length)
    .map(r => r.name as string);
  openKeys.value = parentNames;
}

function handleSourceClick() {
  const source = currentMeta.value?.source as ExtendedRouteMeta['source'];
  if (source?.url) {
    window.open(source.url, '_blank', 'noopener,noreferrer');
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    collapsed.value = true;
  } else {
    collapsed.value = false;
  }
}

function toggleSidebar() {
  collapsed.value = !collapsed.value;
}

function resetScrollPosition() {
  if (pageContentRef.value) {
    pageContentRef.value.scrollTop = 0;
  }
}

watch(
  () => route.name,
  () => {
    updateSelectedKeys();
    updateOpenKeys();
    resetScrollPosition();
  }
);

initItems();

onMounted(() => {
  checkMobile();
  isHydrated.value = true;
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<template>
  <div
    class="side-menu-layout"
    :class="{ 'side-menu-layout--hydrated': isHydrated }"
  >
    <!-- 侧边栏 -->
    <aside
      class="side-menu"
      :class="{ 'side-menu--collapsed': collapsed }"
      :style="{ width: siderWidth }"
    >
      <div class="side-menu__wrapper">
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          class="side-menu__navigation"
        >
          <MenuItems :routes="menuRoutes" />
        </a-menu>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-layout">
      <!-- 菜单切换按钮 -->
      <div v-if="collapsed && isHydrated" class="menu-toggle" @click="toggleSidebar">
        <MenuUnfoldOutlined />
      </div>

      <div class="main-content">
        <!-- 固定标题区 -->
        <div class="page-header">
          <div class="page-header__title-row">
            <component
              v-if="currentIcon"
              :is="currentIcon"
              class="page-header__icon"
            />
            <h1 class="page-header__title">{{ currentMeta?.title }}</h1>
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
        <div ref="pageContentRef" class="page-content">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ========== 外层布局 ========== */
.side-menu-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* 水合完成前禁用所有 transition，避免 SSR → 客户端状态的闪烁 */
.side-menu-layout:not(.side-menu-layout--hydrated) * {
  transition: none !important;
}

.side-menu-layout:not(.side-menu-layout--hydrated) {
  transition: none !important;
}

/* ========== 侧边栏 ========== */
.side-menu {
  background: var(--color-bg-component);
  border-right: 1px solid var(--color-border-light);
  overflow: hidden;
  /* 仅对 width 做 transition，避免全属性过渡引发其他闪烁 */
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.side-menu--collapsed {
  border-right: none;
}

.side-menu__wrapper {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
  /* width 固定 240px，防止内容区随侧边栏 width 收缩而挤压 */
  width: 240px;
}

.side-menu__navigation {
  border-right: none;
  height: 100%;
}

/* ========== 主内容区 ========== */
.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* flex 子项防止内容溢出 */
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

/* ========== 页面标题区 ========== */
.page-header {
  width: calc(100% - var(--spacing-md));
  max-width: 800px;
  margin: 0 auto var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
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

/* ========== 页面内容区 ========== */
.page-content {
  width: calc(100% - var(--spacing-md));
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: var(--color-bg-component);
  border-radius: var(--radius-lg);
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

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .side-menu {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }

  .side-menu--collapsed {
    /* 折叠时用 translate 移出屏幕，而非 width=0（避免内容区挤压动画） */
    width: 240px !important;
    transform: translateX(-240px);
  }

  .main-layout {
    width: 100%;
  }

  .main-content {
    padding: var(--spacing-sm);
    padding-top: 60px;
  }

  .page-header {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }

  .page-content {
    width: 100%;
    margin: 0 auto;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    max-height: calc(100vh - 64px - 240px);
  }

  .page-header__title {
    font-size: var(--font-size-h3);
  }
}

@media (max-width: 1024px) {
  .main-content {
    padding: var(--spacing-md);
  }

  .page-header {
    padding: var(--spacing-lg);
  }

  .page-content {
    padding: var(--spacing-lg);
    max-height: calc(100vh - 64px - 220px);
  }
}
</style>