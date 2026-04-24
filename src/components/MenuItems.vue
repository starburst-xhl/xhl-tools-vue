<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router";

defineProps<{
  routes: RouteRecordRaw[];
}>();
</script>

<template>
  <template v-for="item in routes" :key="item.name">
    <!-- 有子路由的菜单项，渲染为 SubMenu -->
    <template v-if="item.children?.length">
      <a-sub-menu :key="item.name">
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
        <!-- 递归渲染子菜单 -->
        <MenuItems :routes="item.children" />
      </a-sub-menu>
    </template>

    <!-- 没有子路由的菜单项，渲染为 MenuItem + router-link -->
    <a-menu-item v-else :key="item.name">
      <router-link :to="{ name: item.name }" class="menu-item-link">
        {{ item.meta?.title }}
      </router-link>
    </a-menu-item>
  </template>
</template>

<style scoped>
.menu-item-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.menu-item-link--active {
  color: var(--color-primary);
}
</style>
