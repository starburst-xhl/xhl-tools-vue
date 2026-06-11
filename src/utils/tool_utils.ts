import type { RouteRecordRaw } from 'vue-router'
import type { FunctionalComponent } from 'vue';
import type { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon';
import {
  AppstoreOutlined,
  CodeOutlined,
  QrcodeOutlined,
  LockOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  FileImageOutlined,
  BgColorsOutlined,
  TableOutlined,
  DatabaseOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue'

/**
 * 工具来源信息接口
 */
export interface ToolSource {
  name: string // 来源名称
  url?: string // 来源链接（可选）
}

/**
 * 工具信息接口
 */
export interface Tool {
  name: string
  path: string
  title: string
  icon: string
  description: string
  source?: ToolSource // 来源标注（可选）
}

/**
 * 扩展的路由元数据（用于 SideMenuPage 中的类型断言）
 */
export interface ExtendedRouteMeta {
  title?: string
  icon?: string
  description?: string
  source?: ToolSource
}

/**
 * 图标映射表
 */
const iconMap: Record<string, FunctionalComponent<AntdIconProps>> = {
  AppstoreOutlined,
  CodeOutlined,
  QrcodeOutlined,
  LockOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  FileImageOutlined,
  BgColorsOutlined,
  TableOutlined,
  DatabaseOutlined,
  LinkOutlined,
}

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件
 */
export function getIconComponent(iconName: string) {
  return iconMap[iconName] || AppstoreOutlined
}

/**
 * 递归提取所有叶子节点工具
 * @param routes 路由配置数组
 * @param parentPath 父路径
 * @returns 工具列表
 */
export function extractToolsFromRoutes(
  routes: RouteRecordRaw[],
  parentPath: string = ''
): Tool[] {
  const tools: Tool[] = []

  for (const route of routes) {
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path

    // 如果有 component，说明是叶子节点（工具页面）
    if (route.component && route.meta) {
      tools.push({
        name: route.name as string,
        path: fullPath,
        title: route.meta.title as string,
        icon: (route.meta.icon as string) || 'AppstoreOutlined',
        description: (route.meta.description as string) || '',
        source: route.meta.source as ToolSource | undefined,
      })
    }

    // 如果有子路由，递归提取
    if (route.children && route.children.length > 0) {
      tools.push(...extractToolsFromRoutes(route.children, fullPath))
    }
  }

  return tools
}
