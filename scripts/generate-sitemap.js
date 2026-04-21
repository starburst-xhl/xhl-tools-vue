/**
 * Sitemap 生成脚本
 * 运行: node scripts/generate-sitemap.js
 * 读取 src/constants/tool-routes.json 动态生成 sitemap
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = 'https://tools.xhcy.cc'
const today = new Date().toISOString().split('T')[0]

// 读取源工具路由配置
const toolRoutesPath = join(process.cwd(), 'src', 'constants', 'tool-routes.json')

let toolRoutes
try {
  const data = readFileSync(toolRoutesPath, 'utf-8')
  toolRoutes = JSON.parse(data).routes
} catch (e) {
  console.error('❌ 未找到 tool-routes.json')
  process.exit(1)
}

const urlEntries = toolRoutes.map(route => `
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
console.log(`   共 ${toolRoutes.length} 条路由`)