/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 仓库名作为 base 路径
  base: '/xhl-tools-vue/',
  plugins: [
    vue(),
    vueJsx(),
    // 仅在开发环境启用 devtools
    process.env.NODE_ENV === 'development' ? vueDevTools() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  ssgOptions: {
    formatting: 'minify',
  },
  ssr: {
    noExternal: ['ant-design-vue', '@ant-design/icons-vue', '@ant-design/icons-svg', 'crypto-js'],
  },
})
