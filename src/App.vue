<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import HeadBar from "@/components/HeadBar.vue";
import {computed} from "vue";

dayjs.locale('zh-cn');
const locale = zhCN;

const rootRoutes = computed(() => {
  const rootRoute = useRouter().getRoutes().find(route => route.path === '/');
  return rootRoute?.children || [];
});
</script>

<template>
  <a-config-provider :locale="locale">
    <a-app class="full-size">
      <a-layout class="full-size">
        <a-layout-header class="header">
          <head-bar :routes="rootRoutes" />
        </a-layout-header>
        <a-layout>
          <router-view/>
        </a-layout>
      </a-layout>
    </a-app>
  </a-config-provider>
</template>

<style scoped>
</style>
