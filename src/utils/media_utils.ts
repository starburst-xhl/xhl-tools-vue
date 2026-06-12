/**
 * 多媒体处理工具函数集
 *
 * 集中管理图片/音频/视频等媒体文件的编解码、格式转换等工具函数，
 * 为 MediaTool 分类下的所有工具提供复用支持。
 */

// ============================================================
// PNG 格式常量
// ============================================================

/** PNG 文件头魔数（16 字节） */
export const PNG_HEADER = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00,
  0x0d, 0x49, 0x48, 0x44, 0x52,
])

// ============================================================
// RPG Maker MV 加密格式解密
// ============================================================

/**
 * 解密 RPG Maker MV 的 .rpgmvp 加密图片文件
 *
 * 加密原理：以 32 字节头部替换 PNG 文件头（前 16 字节），
 * 解密时跳过前 32 字节，写入标准 PNG 文件头即可还原。
 *
 * @param file - 要解密的 .rpgmvp 文件
 * @returns 还原后的 PNG 文件数据（Uint8Array）
 * @throws 文件不足 32 字节或读取失败时抛出错误
 */
export function decryptRPGMVPFile(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer)
          if (data.length < 32) {
            throw new Error('文件数据长度不足')
          }
          const pngData = new Uint8Array(PNG_HEADER.length + data.length - 32)
          pngData.set(PNG_HEADER)
          pngData.set(data.slice(32), PNG_HEADER.length)
          resolve(pngData)
        } catch {
          reject(new Error('文件解密失败'))
        }
      } else {
        reject(new Error('无法读取文件内容'))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })
}

// ============================================================
// 文件下载工具
// ============================================================

/**
 * 从 Blob 创建下载链接并触发浏览器下载
 *
 * @param blob   - 要下载的二进制数据
 * @param filename - 下载文件名（含扩展名）
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// ============================================================
// ZIP 打包工具
// ============================================================

/**
 * 将多个文件打包为 ZIP 并返回 Blob
 *
 * @param files - 文件列表，每项包含文件名和二进制数据
 * @returns Promise 返回生成的 ZIP 文件的 Blob
 */
export async function createZipFromFiles(
  files: Array<{ name: string; data: Blob | Uint8Array }>,
): Promise<Blob> {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  for (const file of files) {
    zip.file(file.name, file.data)
  }
  return zip.generateAsync({ type: 'blob' })
}

// ============================================================
// 图片格式检测（为未来工具预留）
// ============================================================

/**
 * 从文件前 N 字节检测图片格式
 *
 * @param bytes - 文件头部字节数据（至少 12 字节）
 * @returns 格式名称（如 'png' / 'jpeg' / 'gif' / 'webp' / 'unknown'）
 */
export function detectImageFormat(bytes: Uint8Array): string {
  if (bytes.length < 12) return 'unknown'

  // PNG: 89 50 4E 47
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png'
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg'
  }

  // GIF: 47 49 46 38 (39a / 89a)
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return 'gif'
  }

  // WebP: 52 49 46 46 .... 57 45 42 50
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  ) {
    return 'webp'
  }

  return 'unknown'
}
