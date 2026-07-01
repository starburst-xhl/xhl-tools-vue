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
      let result = renderedHTML

      // SSG 构建会丢失 index.html 模板中的 Content-Security-Policy，
      // 因此需在 onPageRendered 中重新注入 busuanzi CDN 白名单
      if (result.indexOf('https://cdn.busuanzi.cc') === -1) {
        result = result.replace(
          "script-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline' https://cdn.busuanzi.cc"
        )
      }

      // 注入 antdv CSS-in-JS 提取的样式
      if (cache) {
        const styleContent = extractStyle(cache)
        if (styleContent) {
          const insertPos = result.indexOf('</head>')
          if (insertPos !== -1) {
            result = result.slice(0, insertPos) + styleContent + '\n  ' + result.slice(insertPos)
          }
        }
      }

      return result
    },
  },
  ssr: {
    noExternal: [
      'ant-design-vue',
      '@ant-design/icons-vue',
      '@ant-design/icons-svg',
      'crypto-js',
      'jsqr',
    ],
  },
})
