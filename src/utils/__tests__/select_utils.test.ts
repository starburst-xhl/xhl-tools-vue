import { describe, it, expect } from 'vitest'
import {
  recordToSelectOptions,
  arrayToSelectOptions,
} from '@/utils/select_utils'
import type { SelectOptionItem } from '@/utils/select_utils'

describe('select_utils', () => {
  describe('recordToSelectOptions', () => {
    it('将 Record 转换为 SelectOptionItem 数组', () => {
      const input: Record<string, number> = { a: 1, b: 2, c: 3 }
      const result = recordToSelectOptions(input)

      expect(result).toHaveLength(3)
      expect(result).toContainEqual({ label: 'a', value: 1, title: 'a' })
      expect(result).toContainEqual({ label: 'b', value: 2, title: 'b' })
      expect(result).toContainEqual({ label: 'c', value: 3, title: 'c' })
    })

    it('自定义 title', () => {
      const input: Record<string, string> = { key1: 'val1' }
      const result = recordToSelectOptions(input, '自定义标题')

      expect(result[0].title).toBe('自定义标题')
    })

    it('空 Record 返回空数组', () => {
      const result = recordToSelectOptions({})
      expect(result).toHaveLength(0)
    })
  })

  describe('arrayToSelectOptions', () => {
    it('将数字数组转换为 SelectOptionItem 数组', () => {
      const result = arrayToSelectOptions([1, 2, 3])

      expect(result).toEqual([
        { label: '1', value: 1, title: '1' },
        { label: '2', value: 2, title: '2' },
        { label: '3', value: 3, title: '3' },
      ])
    })

    it('将字符串数组转换为 SelectOptionItem 数组', () => {
      const result = arrayToSelectOptions(['a', 'b'])

      expect(result).toEqual([
        { label: 'a', value: 'a', title: 'a' },
        { label: 'b', value: 'b', title: 'b' },
      ])
    })

    it('自定义 title', () => {
      const result = arrayToSelectOptions([1], '选项')
      expect(result[0].title).toBe('选项')
    })

    it('空数组返回空数组', () => {
      const result = arrayToSelectOptions([])
      expect(result).toHaveLength(0)
    })
  })

  describe('SelectOptionItem 类型约束', () => {
    it('number 类型 value', () => {
      const item: SelectOptionItem<number> = { label: 'test', value: 1 }
      expect(item.value).toBeTypeOf('number')
    })

    it('string 类型 value', () => {
      const item: SelectOptionItem<string> = { label: 'test', value: 'abc' }
      expect(item.value).toBeTypeOf('string')
    })
  })
})