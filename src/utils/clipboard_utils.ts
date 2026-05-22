/**
 * 统一剪贴板工具函数
 * 内置 SSR 守卫和 fallback 方案
 */

import { message } from 'ant-design-vue'

/**
 * 将文本复制到剪贴板
 * @param text 要复制的文本
 * @param successMsg 复制成功的提示消息
 * @param errorMsg 复制失败的提示消息
 */
export async function copyToClipboard(
  text: string,
  successMsg: string = '已复制到剪贴板',
  errorMsg: string = '复制失败',
): Promise<boolean> {
  // SSR 守卫
  if (typeof navigator === 'undefined') {
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    message.success(successMsg)
    return true
  } catch {
    // Clipboard API 不可用时使用 fallback
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      message.success(successMsg)
      return true
    } catch {
      message.error(errorMsg)
      return false
    }
  }
}