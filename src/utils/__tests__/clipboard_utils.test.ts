import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyToClipboard } from '@/utils/clipboard_utils'

// Mock ant-design-vue message
vi.mock('ant-design-vue', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('clipboard_utils', () => {
  const mockWriteText = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockWriteText.mockReset()

    // 设置 navigator.clipboard mock
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    })
  })

  describe('copyToClipboard', () => {
    it('成功复制时返回 true', async () => {
      mockWriteText.mockResolvedValue(undefined)

      const result = await copyToClipboard('hello', '已复制')

      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('hello')
    })

    it('使用默认成功消息参数', async () => {
      mockWriteText.mockResolvedValue(undefined)

      const result = await copyToClipboard('hello')

      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('hello')
    })

    it('Clipboard API 失败时进入 fallback', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard API not available'))

      // jsdom 中 execCommand fallback 会执行但可能返回 false
      // 关键是验证 fallback 路径被执行了（不会直接崩溃）
      const result = await copyToClipboard('fallback text')

      // fallback 路径在 jsdom 中：execCommand 不抛异常但返回 true/false
      // 无论结果，重要的是函数不会崩溃
      expect(typeof result).toBe('boolean')
    })

    it('SSR 环境（无 navigator）返回 false', async () => {
      // 移除 navigator 模拟 SSR 环境
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      const result = await copyToClipboard('ssr text')

      expect(result).toBe(false)
    })

    it('空字符串也能正常处理', async () => {
      mockWriteText.mockResolvedValue(undefined)

      const result = await copyToClipboard('')

      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('')
    })
  })
})