/**
 * 路由生成脚本
 * 从 tool-routes.json（嵌套结构）生成 src/router/index.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const toolRoutesPath = join(process.cwd(), 'src', 'constants', 'tool-routes.json')
const routerOutputPath = join(process.cwd(), 'src', 'router', 'index.ts')

interface RouteMeta {
  title?: string
  icon?: string
  description?: string
}

interface RouteConfig {
  path: string
  name?: string
  title?: string
  description?: string
  redirect?: string
  component?: string
  meta?: RouteMeta
  children?: RouteConfig[]
}

interface BuiltRoute {
  path: string
  name?: string
  redirect?: string
  component?: string
  meta?: RouteMeta
  children?: BuiltRoute[]
}

/**
 * 将 kebab-case 路径转换为 PascalCase 名称
 * codec-tool -> CodecTool
 * home -> Home
 */
function pathToName(path: string): string {
  return path
    .replace(/^\//, '')  // 移除开头的 /
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^([a-z])/, (_, c: string) => c.toUpperCase())
}

/**
 * 递归构建路由数组
 */
function buildRoutes(routes: RouteConfig[], parentPath = ''): BuiltRoute[] {
  return routes.map(route => {
    const fullPath = parentPath ? `${parentPath}/${route.path.replace(/^\//, '')}` : route.path

    const result: BuiltRoute = {
      path: route.path,
      name: route.name || pathToName(route.path),
    }

    // 处理重定向
    if (route.redirect) {
      result.redirect = route.redirect
    }

    // 处理组件（只有叶子节点有组件）
    if (route.component) {
      result.component = `() => import('${route.component}')`
    }

    // 处理 meta
    if (route.meta || route.description) {
      result.meta = { ...route.meta }
      if (route.description) {
        result.meta!.description = route.description
      }
      if (route.title) {
        result.meta!.title = route.title
      }
      if (route.meta?.icon) {
        result.meta!.icon = route.meta.icon
      }
    }

    // 递归处理 children
    if (route.children && route.children.length > 0) {
      result.children = buildRoutes(route.children, fullPath)
    }

    return result
  })
}

/**
 * 将单个路由转换为对象字面量字符串
 */
function routeToString(route: BuiltRoute, indent: number): string {
  const spaces = '  '.repeat(indent)
  const parts: string[] = []

  parts.push(`path: '${route.path}'`)

  if (route.name) {
    parts.push(`name: '${route.name}'`)
  }

  if (route.redirect) {
    parts.push(`redirect: '${route.redirect}'`)
  }

  if (route.component) {
    parts.push(`component: ${route.component}`)
  }

  if (route.meta) {
    const metaParts: string[] = []
    if (route.meta.title) metaParts.push(`title: '${route.meta.title}'`)
    if (route.meta.icon) metaParts.push(`icon: '${route.meta.icon}'`)
    if (route.meta.description) metaParts.push(`description: '${route.meta.description}'`)
    if (metaParts.length > 0) {
      parts.push(`meta: { ${metaParts.join(', ')} }`)
    }
  }

  if (route.children) {
    const childIndent = indent + 2
    const childStr = route.children.map(c => routeToString(c, childIndent)).join(',\n')
    return `${spaces}{\n${spaces}  ${parts.join(', ')},\n${spaces}  children: [\n${childStr},\n${spaces}  ]\n${spaces}}`
  }

  return `${spaces}{ ${parts.join(', ')} }`
}

/**
 * 将路由数组转换为 TypeScript 源码
 */
function routesToString(routes: BuiltRoute[], indent = 0): string {
  return routes.map(r => routeToString(r, indent)).join(',\n')
}

export function generateRoutes(): boolean {
  let toolRoutes: RouteConfig[]
  try {
    const data = readFileSync(toolRoutesPath, 'utf-8')
    toolRoutes = JSON.parse(data).routes
  } catch {
    console.error('❌ 未找到 tool-routes.json')
    return false
  }

  const builtRoutes = buildRoutes(toolRoutes)

  // 包装在根路由下，添加 / redirect
  const rootRoute: BuiltRoute = {
    path: '/',
    redirect: '/home',
    children: builtRoutes
  }

  const routesTemplate = `// =========================================================
// ⚠️ 此文件由 scripts/generate-routes.ts 自动生成
// ⚠️ 请勿手动修改！修改 src/constants/tool-routes.json 后自动同步
// =========================================================

export const routes = [
${routesToString([rootRoute], 1)}
]
`

  try {
    writeFileSync(routerOutputPath, routesTemplate, 'utf-8')
    console.log(`✅ 路由配置已生成: ${routerOutputPath}`)
    return true
  } catch (e) {
    console.error(`❌ 路由文件写入失败: ${e}`)
    return false
  }
}

// 如果直接运行此脚本
if (process.argv[1] && process.argv[1].endsWith('generate-routes.ts')) {
  generateRoutes()
}

