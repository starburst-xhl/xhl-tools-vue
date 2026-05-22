import { describe, it, expect } from 'vitest'
import { badString } from '@/utils/string_utils'

describe('badString', () => {
  it('空字符串返回 true', () => {
    expect(badString('')).toBe(true)
  })

  it('非空字符串返回 false', () => {
    expect(badString('hello')).toBe(false)
    expect(badString(' ')).toBe(false) // 空格不是空字符串
    expect(badString('a')).toBe(false)
  })

  it('null 返回 true', () => {
    expect(badString(null)).toBe(true)
  })

  it('undefined 返回 true', () => {
    expect(badString(undefined)).toBe(true)
  })

  it('数字返回 false', () => {
    expect(badString(0)).toBe(false)
    expect(badString(123)).toBe(false)
  })

  it('布尔值返回 false', () => {
    expect(badString(true)).toBe(false)
    expect(badString(false)).toBe(false)
  })

  it('对象返回 false', () => {
    expect(badString({})).toBe(false)
    expect(badString([])).toBe(false)
  })
})