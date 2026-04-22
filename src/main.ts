import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createCache } from 'ant-design-vue/es/_util/cssinjs'

import App from './App.vue'
import { routes } from './router'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: '/' },
  ({ app, router, initialState, onSSRAppRendered }) => {
    const pinia = createPinia()

    // SSR：创建 antdv CSS-in-JS cache
    // 将 cache 同时设为全局属性（供 StyleProvider 使用）和存入 initialState（供 onPageRendered 提取样式）
    const antdCache = createCache()
    app.config.globalProperties.__ANTDV_CSSINJS_CACHE__ = antdCache

    // 安装插件
    app.use(pinia)
    app.use(Antd)

    // SSR：渲染完成后将 cache 存入 initialState
    // 这样 vite.config.ts 的 onPageRendered 钩子可以通过 initialState 读取 cache 提取样式
    if (import.meta.env.SSR) {
      onSSRAppRendered(() => {
        initialState.antdCache = antdCache
      })
    }
  },
)
