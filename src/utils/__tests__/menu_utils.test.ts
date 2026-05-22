import { describe, it, expect } from 'vitest'
import { routeToMenuItems } from '@/utils/menu_utils'
import type { RouteRecordRaw } from 'vue-router'

// MenuItemType 是 ant-design-vue 的内部类型，不直接导入
// 测试中使用更宽松的结构检查
interface MenuResult {
  key: string
  title?: string
  label?: string
  children?: MenuResult[] | null
}

describe('menu_utils', () => {
  describe('routeToMenuItems', () => {
    it('将简单路由转换为菜单项', () => {
      const routes: RouteRecordRaw[] = [
        {
          path: '/home',
          name: 'Home',
          meta: { title: '首页' },
          component: {} as any,
        },
      ]

      const result = routeToMenuItems(routes) as MenuResult[]

      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('Home')
      expect(result[0].title).toBe('首页')
      expect(result[0].label).toBe('首页')
      expect(result[0].children).toBeNull()
    })

    it('将嵌套路由转换为带子菜单的菜单项', () => {
      const routes: RouteRecordRaw[] = [
        {
          path: '/tools',
          name: 'Tools',
          meta: { title: '工具' },
          component: {} as any,
          children: [
            {
              path: 'base64',
              name: 'Base64',
              meta: { title: 'Base64编解码' },
              component: {} as any,
            },
            {
              path: 'aes',
              name: 'AES',
              meta: { title: 'AES加密' },
              component: {} as any,
            },
          ],
        },
      ]

      const result = routeToMenuItems(routes) as MenuResult[]

      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('Tools')
      expect(result[0].children).toHaveLength(2)
      expect(result[0].children![0].key).toBe('Base64')
      expect(result[0].children![1].key).toBe('AES')
    })

    it('无 meta 的路由，title 和 label 为 undefined', () => {
      const routes: RouteRecordRaw[] = [
        {
          path: '/test',
          name: 'Test',
          component: {} as any,
        },
      ]

      const result = routeToMenuItems(routes) as MenuResult[]

      expect(result[0].title).toBeUndefined()
      expect(result[0].label).toBeUndefined()
    })

    it('空路由数组返回空菜单', () => {
      const result = routeToMenuItems([])
      expect(result).toHaveLength(0)
    })

    it('多层嵌套路由递归转换', () => {
      const routes: RouteRecordRaw[] = [
        {
          path: '/parent',
          name: 'Parent',
          meta: { title: '父级' },
          component: {} as any,
          children: [
            {
              path: 'child',
              name: 'Child',
              meta: { title: '子级' },
              component: {} as any,
              children: [
                {
                  path: 'grandchild',
                  name: 'GrandChild',
                  meta: { title: '孙级' },
                  component: {} as any,
                },
              ],
            },
          ],
        },
      ]

      const result = routeToMenuItems(routes) as MenuResult[]

      expect(result[0].children![0].children).toHaveLength(1)
      expect(result[0].children![0].children![0].key).toBe('GrandChild')
    })
  })
})