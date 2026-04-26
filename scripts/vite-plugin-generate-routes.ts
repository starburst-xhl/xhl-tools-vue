/**
 * Vite 插件：监听 tool-routes.json 变化，自动重新生成路由配置
 */
import { generateRoutes } from './generate-routes'
import { watch } from 'node:fs'
import type { Plugin } from 'vite'

export default function vitePluginGenerateRoutes(): Plugin {
  return {
    name: 'vite-plugin-generate-routes',

    // 在构建开始前生成路由（适用于 dev 和 build）
    buildStart() {
      generateRoutes()
    },

    // 监听 tool-routes.json 变化（仅 dev 模式）
    configureServer(server) {
      // 监听 tool-routes.json 变化
      const watcher = watch('src/constants/tool-routes.json', (eventType, filename) => {
        if (eventType === 'change' && filename) {
          console.log(`\n📝 ${filename} 发生变化，重新生成路由...`)
          generateRoutes()
        }
      })

      // 确保在服务器关闭时停止监听
      server.httpServer?.on('close', () => {
        watcher.close()
      })
    },

    // 构建结束时清理
    closeBundle() {
      // nothing to do
    }
  }
}
