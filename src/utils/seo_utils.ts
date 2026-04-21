/**
 * SEO 工具函数
 * 用于动态更新页面标题和 meta 标签
 */
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { toolRoutes } from '@/constants/tool-routes'

const BASE_URL = 'https://starburst-xhl.github.io/xhl-tools-vue'
const SITE_NAME = 'XHL Tools'
const DEFAULT_DESCRIPTION = '开源免费的工具集合网站，提供Base64编解码、二维码生成、AES加密、JSON格式化、密码生成器等多种在线工具'

interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
  author?: string
  image?: string
  noindex?: boolean
}

/**
 * 根据路由 meta 信息更新页面 SEO
 */
export function usePageSeo() {
  const route = useRoute()

  const pageSeo = computed<SeoMeta>(() => {
    const meta = route.meta
    return {
      title: meta?.title as string || SITE_NAME,
      description: meta?.description as string || DEFAULT_DESCRIPTION,
      keywords: meta?.keywords as string || '在线工具,开发工具,Base64,AES,JSON',
      author: 'XHL Tools',
      image: `${BASE_URL}/og-image.png`,
      noindex: meta?.noindex as boolean || false,
    }
  })

  // 动态更新 head
  useHead(computed(() => {
    const seo = pageSeo.value
    const fullTitle = seo.title === SITE_NAME ? SITE_NAME : `${seo.title} - ${SITE_NAME}`

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: seo.description },
        { name: 'keywords', content: seo.keywords },
        { name: 'author', content: seo.author },
        { name: 'robots', content: seo.noindex ? 'noindex, nofollow' : 'index, follow' },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: seo.description },
        { property: 'og:image', content: seo.image },
        { property: 'og:url', content: `${BASE_URL}${route.path}` },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: seo.description },
        { name: 'twitter:image', content: seo.image },
      ],
      link: [
        { rel: 'canonical', href: `${BASE_URL}${route.path}` },
      ],
    }
  }))

  // 监听路由变化，确保及时更新
  watch(() => route.path, () => {
    // useHead 会自动追踪 computed 的变化，这里不需要额外处理
  })
}

/**
 * 获取所有页面的 SEO 数据（用于生成 sitemap）
 * 从 toolRoutes 动态读取，不再需要手动维护
 */
export function getAllPagesSeo() {
  return toolRoutes.map(route => ({
    path: route.path,
    title: route.title,
    description: route.description,
    url: `${BASE_URL}${route.path}`,
  }))
}
