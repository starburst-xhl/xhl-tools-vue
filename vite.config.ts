/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const require = createRequire(import.meta.url)
// 在 ESM 环境中通过 createRequire 加载 antdv CJS 模块
const { extractStyle } = require('ant-design-vue/lib/_util/cssinjs')

// https://vite.dev/config/
export default defineConfig({
  // 自定义域名 tools.xhcy.cc，无需子路径
  base: '/',
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
    // SSR 样式提取：将 antdv CSS-in-JS 生成的样式注入到 HTML 中，防止闪烁
    onPageRendered(_route, renderedHTML, appCtx) {
      const cache = appCtx.initialState?.antdCache
      if (cache) {
        // extractStyle(cache, false) 返回 <style> 标签包裹的 HTML 字符串
        // extractStyle(cache, true) 返回纯 CSS 文本（不含 <style> 标签）
        // 这里需要用 false（默认值），确保样式被 <style> 标签包裹
        const styleContent = extractStyle(cache)
        if (styleContent) {
          return renderedHTML.replace('</head>', `${styleContent}</head>`)
        }
      }
      return renderedHTML
    },
  },
  ssr: {
    noExternal: ['ant-design-vue', '@ant-design/icons-vue', '@ant-design/icons-svg', 'crypto-js'],
  },
})
