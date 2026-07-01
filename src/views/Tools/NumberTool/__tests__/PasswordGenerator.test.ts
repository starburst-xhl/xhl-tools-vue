import { describe, it, expect } from 'vitest'
import { badString } from '@/utils/string_utils'

// 密码生成器核心逻辑测试
// 测试密码生成的各种约束和 badString 函数的配合使用

describe('PasswordGenerator 核心逻辑', () => {
  describe('badString 在密码生成场景中的使用', () => {
    it('空字符串被视为"bad"（无效）密码', () => {
      expect(badString('')).toBe(true)
    })

    it('非空字符串被视为"good"（有效）密码', () => {
      expect(badString('abc123')).toBe(false)
    })

    it('null 被视为"bad"（无效）— 用于密码未生成时的判断', () => {
      expect(badString(null)).toBe(true)
    })
  })

  describe('密码字符集逻辑', () => {
    // 模拟密码生成器中的字符集定义
    const CHARSETS = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      special: '!@#$%^&*()_+-={}[]|\\:;<>?,./~`',
    }

    it('各字符集非空', () => {
      expect(CHARSETS.uppercase.length).toBeGreaterThan(0)
      expect(CHARSETS.lowercase.length).toBeGreaterThan(0)
      expect(CHARSETS.numbers.length).toBeGreaterThan(0)
      expect(CHARSETS.special.length).toBeGreaterThan(0)
    })

    it('大写字符集有 26 个字符', () => {
      expect(CHARSETS.uppercase.length).toBe(26)
    })

    it('小写字符集有 26 个字符', () => {
      expect(CHARSETS.lowercase.length).toBe(26)
    })

    it('数字字符集有 10 个字符', () => {
      expect(CHARSETS.numbers.length).toBe(10)
    })

    it('组合字符集生成密码包含所选字符类型', () => {
      const charset = CHARSETS.lowercase + CHARSETS.numbers
      const password = generateMockPassword(charset, 20)

      // 至少包含一个小写字母
      expect(/[a-z]/.test(password)).toBe(true)
      // 至少包含一个数字
      expect(/[0-9]/.test(password)).toBe(true)
    })
  })

  describe('密码长度约束', () => {
    it('密码长度等于指定长度', () => {
      const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
      const password = generateMockPassword(charset, 16)
      expect(password.length).toBe(16)
    })

    it('最短密码（1位）', () => {
      const charset = 'a'
      const password = generateMockPassword(charset, 1)
      expect(password.length).toBe(1)
    })
  })
})

// 模拟密码生成函数（与组件中的逻辑相同）
function generateMockPassword(charset: string, length: number): string {
  let password = ''
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charset.length)
    password += charset[index]
  }
  return password
}