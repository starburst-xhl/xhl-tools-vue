/**
 * Sitemap 生成脚本
 * 运行: npx tsx scripts/generate-sitemap.ts
 * 读取 src/constants/tool-routes.json（嵌套结构）动态生成 sitemap
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://tools.xhcy.cc'
const today = new Date().toISOString().split('T')[0]

const toolRoutesPath = join(process.cwd(), 'src', 'constants', 'tool-routes.json')

interface RouteConfig {
  path: string
  changefreq?: string
  priority?: string
  children?: RouteConfig[]
}

/**
 * 递归展平嵌套路由，收集所有叶子节点的 path
 */
function flattenRoutes(routes: RouteConfig[], parentPath = ''): { path: string; changefreq: string; priority: string }[] {
  const urls: { path: string; changefreq: string; priority: string }[] = []

  for (const route of routes) {
    const fullPath = parentPath ? `${parentPath}/${route.path.replace(/^\//, '')}` : route.path

    // 如果有 children，递归处理
    if (route.children && route.children.length > 0) {
      urls.push(...flattenRoutes(route.children, fullPath))
    } else {
      // 叶子节点，添加到 sitemap
      urls.push({
        path: fullPath,
        changefreq: route.changefreq || 'monthly',
        priority: route.priority || '0.5'
      })
    }
  }

  return urls
}

let toolRoutes: RouteConfig[]
try {
  const data = readFileSync(toolRoutesPath, 'utf-8')
  toolRoutes = JSON.parse(data).routes
} catch {
  console.error('❌ 未找到 tool-routes.json')
  process.exit(1)
}

const flatRoutes = flattenRoutes(toolRoutes)
const urlEntries = flatRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

const distDir = join(process.cwd(), 'dist')
writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf-8')

console.log('✅ sitemap.xml 生成成功！')
console.log(`   共 ${flatRoutes.length} 条路由`)
