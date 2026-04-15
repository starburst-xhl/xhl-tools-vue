<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {type RouteRecordRaw, useRoute, useRouter} from "vue-router";
import {badString} from "@/utils/string_utils.ts";
import {GithubOutlined} from "@ant-design/icons-vue";

const router = useRouter();

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
const handleMenuSelect = (params: { key: string }) => {
  router.push({name: params.key});
};

watch(route, () => {
  const name = routeCurrent.value
  if (!badString(name)) {
    currentItem.value = [name as string];
  }
});
</script>

<template>
  <div class="head-bar__container">
    <div class="head-bar__left-container">
      <img src="@/assets/logo.jpg" alt="Logo" width="48">
      <a-menu
        v-model:selected-keys="currentItem"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        @click="handleMenuSelect"
      >
        <a-menu-item v-for="route in routes" :key="route.name">{{ route.meta?.title ?? '-' }}</a-menu-item>
      </a-menu>
    </div>
    <div class="head-bar__button-container">
      <a-tooltip title="Github">
        <a-button type="text" href="https://github.com/starburst-xhl/xhl-tools-vue" target="_blank">
          <GithubOutlined/>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped>
.head-bar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-bar__left-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.head-bar__button-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
