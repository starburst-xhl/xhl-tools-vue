<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { type RouteRecordRaw, useRoute } from "vue-router";
import { badString } from "@/utils/string_utils.ts";
import { GithubOutlined } from "@ant-design/icons-vue";

defineProps<{
  routes: RouteRecordRaw[];
}>()

const currentItem = ref<string[]>([]);
const route = useRoute();
const routeCurrent = computed(() => {
  const name = route?.matched[1]?.name;
  if (badString(name)) {
    return undefined;
  } else {
    return name;
  }
});

watch(route, () => {
  const name = routeCurrent.value
  if (!badString(name)) {
    currentItem.value = [name as string];
  }
}, { immediate: true });
</script>

<template>
  <div class="head-bar">
    <div class="head-bar__left">
      <div class="head-bar__logo">
        <img src="@/assets/logo.jpg" alt="XHL Tools" class="logo-image" width="40" height="40">
        <span class="logo-text">XHL Tools</span>
      </div>

      <a-menu
        v-model:selectedKeys="currentItem"
        mode="horizontal"
        class="head-bar__menu"
      >
        <a-menu-item
          v-for="route in routes"
          :key="route.name"
          class="head-bar__menu-item"
        >
          <router-link :to="{ name: route.name }" class="head-bar__menu-link">
            {{ route.meta?.title ?? '-' }}
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>

    <div class="head-bar__right">
      <a-tooltip title="访问 GitHub 仓库">
        <a-button
          type="text"
          href="https://github.com/starburst-xhl/xhl-tools-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="head-bar__github-btn"
        >
          <GithubOutlined />
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped>
.head-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 var(--spacing-xl);
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.head-bar__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex: 1;
}

.head-bar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.logo-text {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-title);
}

.head-bar__menu {
  flex: 1;
  border-bottom: none;
  line-height: 62px;
}

.head-bar__menu-item {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
}

.head-bar__menu-item:hover {
  color: var(--color-primary);
}

.head-bar__menu-link {
  color: inherit;
  text-decoration: none;
}

.head-bar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.head-bar__github-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  font-size: 20px;
  transition: var(--transition-fast);
}

.head-bar__github-btn:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .head-bar {
    padding: 0 var(--spacing-md);
  }

  .logo-text {
    display: none;
  }

  .head-bar__menu {
    font-size: var(--font-size-body-sm);
  }
}
</style>
