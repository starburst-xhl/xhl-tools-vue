<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import type {MenuItemType} from "ant-design-vue/es/menu/src/interface";
import {routeToMenuItems} from "@/utils/menu_utils.ts";

const router = useRouter();

const selectedKeys = ref<string[]>([]);
const openKeys = ref([]);
const items = ref<MenuItemType[]>([]);

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
  router.push({name: params.key});
}

onMounted(() => {
  initItems();
});
</script>

<template>
  <a-layout-sider width="256" style="background: white">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :items="items"
      @click="handleMenuClick"
      style="height: 100%"
    />
  </a-layout-sider>
  <a-layout style="background-color: #fafafa">
    <a-layout-content class="main-content-layout">
      <div class="full-size" style="overflow-y: auto">
        <div class="main-content-layout__container">
          <div class="main-content-layout__title">
            <span class="side-menu-page__title">{{ useRoute().meta?.title }}</span>
          </div>
          <div class="main-content-layout__content">
            <router-view/>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.main-content-layout {
  background: white;
  padding: 24px;
  margin: 18px;
  border-radius: 10px;
  height: 100%;
}

.main-content-layout__container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.main-content-layout__title {
  width: 600px;
}

.main-content-layout__content {
  min-width: 600px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.side-menu-page__title {
  font-size: 24px;
  margin-bottom: 24px;
  display: block;
  font-weight: bold;
}
</style>
