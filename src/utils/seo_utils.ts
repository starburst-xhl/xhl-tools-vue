/**
 * SEO 工具函数
 * 用于动态更新页面标题和 meta 标签
 */
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// 从环境变量读取站点配置
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'XHL Tools'
const SITE_TAGLINE = import.meta.env.VITE_SITE_TAGLINE || '在线工具集合'
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://tools.xhcy.cc'

const DEFAULT_DESCRIPTION = 'XHL Tools - 开源免费的在线工具集合，提供Base64编解码、二维码生成、AES加密、JSON格式化、密码生成器、Mock数据等多种实用开发工具，无需安装，即开即用'

interface SeoMeta {
  title?: string
  description?: string
  seoDescription?: string
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
    const meta = route.meta as SeoMeta
    return {
      title: meta?.title as string || SITE_NAME,
      description: meta?.description as string || DEFAULT_DESCRIPTION,
      seoDescription: meta?.seoDescription as string,
      keywords: meta?.keywords as string || '在线工具,开发工具,Base64,AES,JSON,免费工具',
      author: 'XHL Tools',
      image: `${BASE_URL}/og-image.png`,
      noindex: meta?.noindex as boolean || false,
    }
  })

  // 动态更新 head
  useHead(computed(() => {
    const seo = pageSeo.value
    // SEO Title 格式: {meta.title} - {SITE_TAGLINE} - {SITE_NAME}
    const fullTitle = seo.title === SITE_NAME
      ? 'XHL Tools - 在线工具集合 | Base64编解码,二维码生成,AES加密'
      : `${seo.title} - ${SITE_TAGLINE} - ${SITE_NAME} | 免费在线开发工具`

    // SEO Description 优先使用 seoDescription
    const metaDescription = seo.seoDescription || seo.description || DEFAULT_DESCRIPTION

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: metaDescription },
        { name: 'keywords', content: seo.keywords },
        { name: 'author', content: seo.author },
        { name: 'robots', content: seo.noindex ? 'noindex, nofollow' : 'index, follow' },
        // 安全头
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'referrer-policy', content: 'strict-origin-when-cross-origin' },
        { 'http-equiv': 'X-Frame-Options', content: 'SAMEORIGIN' },
        { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.busuanzi.cc; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
        // Open Graph
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: metaDescription },
        { property: 'og:image', content: seo.image },
        { property: 'og:url', content: `${BASE_URL}${route.path}` },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: seo.image },
      ],
      link: [
        { rel: 'canonical', href: `${BASE_URL}${route.path}` },
      ],
    }
  }))
}
