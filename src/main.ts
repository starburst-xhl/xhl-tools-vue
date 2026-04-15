import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import { routes } from './router'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: '/xhl-tools-vue/' },
  ({ app, router, initialState }) => {
    const pinia = createPinia()
    
    // 安装插件
    app.use(pinia)
    app.use(Antd)
  }
)
