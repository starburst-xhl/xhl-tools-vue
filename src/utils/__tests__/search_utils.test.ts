import { describe, it, expect } from 'vitest'
import type { SearchInfoItem, SearchInfo } from '@/utils/search_utils'

describe('search_utils', () => {
  describe('SearchInfoItem 类型', () => {
    it('创建有效的 SearchInfoItem', () => {
      const item: SearchInfoItem<string> = {
        title: 'Base64编解码',
        key: 'base64',
        description: '在线Base64编码和解码工具',
        pathName: 'Base64',
      }

      expect(item.title).toBe('Base64编解码')
      expect(item.key).toBe('base64')
      expect(item.description).toBe('在线Base64编码和解码工具')
      expect(item.pathName).toBe('Base64')
    })

    it('SearchInfo 数组类型', () => {
      const info: SearchInfo<string> = [
        { title: '工具A', key: 'a', description: '描述A', pathName: 'ToolA' },
        { title: '工具B', key: 'b', description: '描述B', pathName: 'ToolB' },
      ]

      expect(info).toHaveLength(2)
      expect(info[0].key).toBe('a')
    })
  })
})