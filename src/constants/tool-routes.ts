/**
 * 工具路由配置
 * 集中管理所有工具路由信息，新增加工具时只需在此文件添加
 * 被 src/router/index.ts 和 src/utils/seo_utils.ts 共同使用
 */
import toolRoutesData from './tool-routes.json'

export interface ToolRoute {
  path: string
  title: string
  description: string
  icon?: string
  category: string
  priority: string
  changefreq: string
}

export const toolRoutes: ToolRoute[] = toolRoutesData.routes