<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {type RouteRecordRaw, useRoute} from "vue-router";
import router from "@/router";
import {badString} from "@/utils/string_utils.ts";

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
  <div>
    <div class="logo">
    </div>
    <a-menu
      v-model:selected-keys="currentItem"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
      @click="handleMenuSelect"
    >
      <a-menu-item v-for="route in routes" :key="route.name">{{ route.meta?.title ?? '-' }}</a-menu-item>
    </a-menu>
  </div>
</template>

<style scoped>

</style>
