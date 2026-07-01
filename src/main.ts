import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createCache } from 'ant-design-vue/es/_util/cssinjs'

import App from './App.vue'
import { routes } from './router'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: '/' },
  ({ app, initialState, onSSRAppRendered }) => {
    const pinia = createPinia()

    // SSR：创建 antdv CSS-in-JS cache
    const antdCache = createCache()
    app.config.globalProperties.__ANTDV_CSSINJS_CACHE__ = antdCache

    // 安装插件
    app.use(pinia)

    // SSR：渲染完成后将 cache 存入 initialState
    if (import.meta.env.SSR) {
      onSSRAppRendered(() => {
        initialState.antdCache = antdCache
      })
    }
  },
)
