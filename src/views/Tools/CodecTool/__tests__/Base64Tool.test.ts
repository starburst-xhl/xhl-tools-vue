import { describe, it, expect } from 'vitest'

// Base64 编解码的核心逻辑测试（纯函数，不依赖 Vue 组件）
// 因为 Vue 组件的 encode/decode 是 ref 操作，我们直接测试核心算法

describe('Base64 编解码核心逻辑', () => {
  describe('Unicode 安全的 Base64 编码', () => {
    const unicodeSafeEncode = (text: string): string => {
      return btoa(unescape(encodeURIComponent(text)))
    }

    const unicodeSafeDecode = (encoded: string): string => {
      return decodeURIComponent(escape(atob(encoded)))
    }

    it('ASCII 字本编码解码', () => {
      const text = 'Hello, World!'
      const encoded = unicodeSafeEncode(text)
      expect(encoded).toBe('SGVsbG8sIFdvcmxkIQ==')
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('中文编码解码', () => {
      const text = '你好世界'
      const encoded = unicodeSafeEncode(text)
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('混合中英文编码解码', () => {
      const text = 'Hello 你好 World 世界'
      const encoded = unicodeSafeEncode(text)
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('emoji 编码解码', () => {
      const text = '😀🎉'
      const encoded = unicodeSafeEncode(text)
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('空字符串编码', () => {
      const encoded = unicodeSafeEncode('')
      expect(encoded).toBe('')
      expect(unicodeSafeDecode(encoded)).toBe('')
    })

    it('特殊字符编码解码', () => {
      const text = '!@#$%^&*()_+-={}[]|\\:;<>?,./'
      const encoded = unicodeSafeEncode(text)
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('长文本编码解码', () => {
      const text = '这是一段很长的中文文本，用于测试Base64编码在处理长文本时的正确性。需要确保编码后的数据可以被正确还原。'
      const encoded = unicodeSafeEncode(text)
      expect(unicodeSafeDecode(encoded)).toBe(text)
    })

    it('无效 Base64 解码时抛出异常', () => {
      expect(() => atob('这不是有效的base64!!!')).toThrow()
    })

    it('btoa 直接处理中文会报错（证明 unicodeSafeEncode 的必要性）', () => {
      // 原生 btoa 无法处理超出 Latin1 范围的字符
      expect(() => btoa('中文')).toThrow()
    })
  })
})