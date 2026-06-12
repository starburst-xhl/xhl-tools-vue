/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import generateRoutesPlugin from './scripts/vite-plugin-generate-routes'

const require = createRequire(import.meta.url)
// 在 ESM 环境中通过 createRequire 加载 antdv CJS 模块
const { extractStyle } = require('ant-design-vue/lib/_util/cssinjs')

export default defineConfig({
  // 自定义域名 tools.xhcy.cc，无需子路径
  base: '/',
  plugins: [
    vue(),
    vueJsx(),
    // 自动从 tool-routes.json 生成路由配置
    generateRoutesPlugin(),
    // 仅在开发环境启用 devtools
    process.env.NODE_ENV === 'development' ? vueDevTools() : null,
    // 自动按需引入组件
    Components({
      resolvers: [
        AntDesignVueResolver({
          // 使用 CSS-in-JS 方式（保持与 SSR 兼容）
          importStyle: 'css-in-js',
        }),
      ],
    }),
    // 自动按需引入 API（ref, computed, watch 等）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
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
        const styleContent = extractStyle(cache)
        if (styleContent) {
          return renderedHTML.replace('</head>', `${styleContent}</head>`)
        }
      }
      return renderedHTML
    },
  },
  ssr: {
    noExternal: [
      'ant-design-vue',
      '@ant-design/icons-vue',
      '@ant-design/icons-svg',
      'crypto-js',
      'jsqr',
      'browser-image-compression',
      '@ffmpeg/ffmpeg',
      '@ffmpeg/util',
    ],
  },
})
