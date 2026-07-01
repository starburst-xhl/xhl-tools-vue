import { describe, it, expect } from 'vitest'
import { extractToolsFromRoutes, getIconComponent } from '@/utils/tool_utils'
import type { RouteRecordRaw } from 'vue-router'
import { AppstoreOutlined, CodeOutlined } from '@ant-design/icons-vue'

describe('tool_utils', () => {
  describe('getIconComponent', () => {
    it('已知图标名称返回对应组件', () => {
      expect(getIconComponent('CodeOutlined')).toBe(CodeOutlined)
      expect(getIconComponent('QrcodeOutlined')).toBeDefined()
    })

    it('未知图标名称返回 AppstoreOutlined 默认组件', () => {
      expect(getIconComponent('UnknownIcon')).toBe(AppstoreOutlined)
      expect(getIconComponent('')).toBe(AppstoreOutlined)
    })
  })

  describe('extractToolsFromRoutes', () => {
    it('提取叶子节点工具', () => {
      const routes = [
        {
          path: 'base64-tool',
          name: 'Base64Tool',
          component: () => import('@/views/Tools/CodecTool/Base64Tool.vue'),
          meta: { title: 'Base64 编解码', icon: 'CodeOutlined', description: '编解码工具' },
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)

      expect(tools).toHaveLength(1)
      expect(tools[0]).toEqual({
        name: 'Base64Tool',
        path: 'base64-tool',
        title: 'Base64 编解码',
        icon: 'CodeOutlined',
        description: '编解码工具',
        source: undefined,
      })
    })

    it('递归提取嵌套路由中的叶子工具', () => {
      const routes = [
        {
          path: '/tools',
          name: 'Tools',
          meta: { title: '工具' },
          // 父路由有 meta 但也有 children，所以不会被当作叶子节点
          children: [
            {
              path: 'base64-tool',
              name: 'Base64Tool',
              component: {} as RouteRecordRaw['component'],
              meta: { title: 'Base64', icon: 'CodeOutlined', description: '编解码' },
            },
            {
              path: 'aes-tool',
              name: 'AesTool',
              component: {} as RouteRecordRaw['component'],
              meta: { title: 'AES', icon: 'LockOutlined', description: '加密' },
            },
          ],
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)

      expect(tools).toHaveLength(2)
      expect(tools[0].name).toBe('Base64Tool')
      expect(tools[1].name).toBe('AesTool')
    })

    it('parentPath 正确拼接', () => {
      const routes = [
        {
          path: 'base64-tool',
          name: 'Base64Tool',
          component: {} as RouteRecordRaw['component'],
          meta: { title: 'Base64', icon: 'CodeOutlined', description: '编解码' },
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes, '/tools')

      expect(tools[0].path).toBe('/tools/base64-tool')
    })

    it('没有 meta 的叶子节点不会被提取', () => {
      const routes = [
        {
          path: 'test',
          name: 'Test',
          component: {} as RouteRecordRaw['component'],
          // 无 meta
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)
      expect(tools).toHaveLength(0)
    })

    it('没有 component 的路由不会被当作叶子节点', () => {
      const routes = [
        {
          path: '/tools',
          name: 'Tools',
          meta: { title: '工具' },
          redirect: '/tools/tool-home',
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)
      expect(tools).toHaveLength(0)
    })

    it('默认 icon 为 AppstoreOutlined', () => {
      const routes = [
        {
          path: 'test',
          name: 'Test',
          component: {} as RouteRecordRaw['component'],
          meta: { title: 'Test', description: '测试' }, // 无 icon
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)
      expect(tools[0].icon).toBe('AppstoreOutlined')
    })

    it('默认 description 为空字符串', () => {
      const routes = [
        {
          path: 'test',
          name: 'Test',
          component: {} as RouteRecordRaw['component'],
          meta: { title: 'Test', icon: 'CodeOutlined' }, // 无 description
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)
      expect(tools[0].description).toBe('')
    })

    it('提取带 source 的工具', () => {
      const routes = [
        {
          path: 'rpgmvp-to-png',
          name: 'RpgmvpToPng',
          component: {} as RouteRecordRaw['component'],
          meta: {
            title: 'RPGMVP转PNG',
            icon: 'FileImageOutlined',
            description: '格式转换',
            source: { name: 'rpgmvp2png', url: 'https://github.com/test' },
          },
        },
      ] as RouteRecordRaw[]

      const tools = extractToolsFromRoutes(routes)
      expect(tools[0].source).toEqual({ name: 'rpgmvp2png', url: 'https://github.com/test' })
    })

    it('空路由数组返回空工具列表', () => {
      const tools = extractToolsFromRoutes([])
      expect(tools).toHaveLength(0)
    })
  })
})
