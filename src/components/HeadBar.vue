<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { type RouteRecordRaw, useRoute } from "vue-router";
import { badString } from "@/utils/string_utils.ts";
import { GithubOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons-vue";

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

// --- busuanzi 统计数据持久化 (sessionStorage) ---
const BUSUANZI_PV_KEY = 'busuanzi_site_pv';
const BUSUANZI_UV_KEY = 'busuanzi_site_uv';

const sitePv = ref(sessionStorage.getItem(BUSUANZI_PV_KEY) || '0');
const siteUv = ref(sessionStorage.getItem(BUSUANZI_UV_KEY) || '0');

let observer: MutationObserver | null = null;

onMounted(() => {
  // 监听 busuanzi 脚本填充数据
  const pvEl = document.getElementById('busuanzi_site_pv');
  const uvEl = document.getElementById('busuanzi_site_uv');

  if (pvEl && uvEl) {
    // 初始读取（busuanzi 可能比 Vue hydration 更早执行）
    const pvText = pvEl.textContent?.trim();
    const uvText = uvEl.textContent?.trim();
    if (pvText && pvText !== '0') {
      sitePv.value = pvText;
      sessionStorage.setItem(BUSUANZI_PV_KEY, pvText);
    }
    if (uvText && uvText !== '0') {
      siteUv.value = uvText;
      sessionStorage.setItem(BUSUANZI_UV_KEY, uvText);
    }

    // 使用 MutationObserver 监听后续变化
    observer = new MutationObserver(() => {
      const pv = pvEl.textContent?.trim();
      const uv = uvEl.textContent?.trim();
      if (pv && pv !== '0') {
        sitePv.value = pv;
        sessionStorage.setItem(BUSUANZI_PV_KEY, pv);
      }
      if (uv && uv !== '0') {
        siteUv.value = uv;
        sessionStorage.setItem(BUSUANZI_UV_KEY, uv);
      }
    });

    observer.observe(pvEl, { characterData: true, subtree: true });
    observer.observe(uvEl, { characterData: true, subtree: true });
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
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
      <div class="head-bar__stats">
        <a-tooltip title="全站总访问量">
          <span class="head-bar__stat-item">
            <EyeOutlined />
            <span id="busuanzi_site_pv">{{ sitePv }}</span>
          </span>
        </a-tooltip>
        <a-tooltip title="全站总访客数">
          <span class="head-bar__stat-item">
            <UserOutlined />
            <span id="busuanzi_site_uv">{{ siteUv }}</span>
          </span>
        </a-tooltip>
      </div>
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

.head-bar__stats {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.head-bar__stat-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  font-size: 13px;
  transition: var(--transition-fast);
  cursor: default;
}

.head-bar__stat-item:hover {
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

  .head-bar__stats {
    display: none;
  }
}
</style>
