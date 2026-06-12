/**
 * 编码乱码修复工具函数
 * 支持中文(GBK/Big5)、日文(Shift_JIS)、韩文(EUC-KR)及常见编码修复
 * 所有处理在浏览器端完成，不依赖外部库
 */

// ===== 编码反向映射表（一次性构建、全局缓存） =====

interface EncodingMap {
  name: string
  label: string
  // 从 Unicode codePoint → 该编码下的原始字节序列
  reverseMap: Map<number, number[]>
  built: boolean
}

const encodingMaps: Record<string, EncodingMap> = {
  gbk: { name: 'gbk', label: 'GBK', reverseMap: new Map(), built: false },
  'shift-jis': { name: 'shift-jis', label: 'Shift_JIS', reverseMap: new Map(), built: false },
  'euc-kr': { name: 'euc-kr', label: 'EUC-KR', reverseMap: new Map(), built: false },
  big5: { name: 'big5', label: 'Big5', reverseMap: new Map(), built: false },
}

// 单字节编码列表 — 编码字符串 → 解码字符串（反向转换直接 charCodeAt & 0xFF）
const SINGLE_BYTE_ENCODINGS = new Set([
  'latin1', 'iso-8859-1', 'windows-1252',
  'iso-8859-2', 'iso-8859-15', 'macintosh',
])

/** 判断是否为单字节编码 */
function isSingleByteEncoding(encoding: string): boolean {
  return SINGLE_BYTE_ENCODINGS.has(encoding)
}

/**
 * 构建指定多字节编码的反向映射表
 * 遍历该编码的所有有效字节对，建立 Unicode → 原始字节 的映射
 */
function buildEncodingMap(encoding: string): void {
  const map = encodingMaps[encoding]
  if (!map || map.built) return

  let decoder: TextDecoder
  try {
    decoder = new TextDecoder(encoding, { fatal: false })
  } catch {
    return
  }

  const range1: [number, number][] = []
  const range2: [number, number][] = []

  switch (encoding) {
    case 'gbk':
      range1.push([0x81, 0xFE])
      range2.push([0x40, 0x7E], [0x80, 0xFE])
      break
    case 'shift-jis':
      range1.push([0x81, 0x9F], [0xE0, 0xEF])
      range2.push([0x40, 0x7E], [0x80, 0xFC])
      break
    case 'euc-kr':
      range1.push([0xA1, 0xFE])
      range2.push([0xA1, 0xFE])
      break
    case 'big5':
      range1.push([0xA1, 0xF9])
      range2.push([0x40, 0x7E], [0xA1, 0xFE])
      break
    default:
      return
  }

  for (const [b1Start, b1End] of range1) {
    for (let b1 = b1Start; b1 <= b1End; b1++) {
      for (const [b2Start, b2End] of range2) {
        for (let b2 = b2Start; b2 <= b2End; b2++) {
          if (b2 === 0x7F) continue
          try {
            const bytes = new Uint8Array([b1, b2])
            const char = decoder.decode(bytes)
            if (char && char.length === 1) {
              const cp = char.charCodeAt(0)
              if (!map.reverseMap.has(cp)) {
                map.reverseMap.set(cp, [b1, b2])
              }
            }
          } catch {
            // skip invalid byte pairs
          }
        }
      }
    }
  }
  map.built = true
}

/**
 * 将文本编码为指定编码的字节数组
 * @param text 输入文本
 * @param encoding 目标编码
 * @returns 字节数组
 */
function encodeAsBytes(text: string, encoding: string): Uint8Array {
  // 单字节编码 — 直接取字符低字节
  if (isSingleByteEncoding(encoding)) {
    const bytes = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      bytes[i] = text.charCodeAt(i) & 0xFF
    }
    return bytes
  }

  // 多字节编码 — 使用反向映射表
  const map = encodingMaps[encoding]
  if (!map || !map.built) {
    // fallback to single-byte
    const bytes = new Uint8Array(text.length)
    for (let i = 0; i < text.length; i++) {
      bytes[i] = text.charCodeAt(i) & 0xFF
    }
    return bytes
  }

  const result: number[] = []
  for (const char of text) {
    const cp = char.charCodeAt(0)
    if (cp < 0x80) {
      // ASCII 范围内直接保留
      result.push(cp)
    } else {
      const gbkBytes = map.reverseMap.get(cp)
      if (gbkBytes) {
        result.push(gbkBytes[0], gbkBytes[1])
      } else {
        // 不在该编码中，用问号代替
        result.push(0x3F)
      }
    }
  }
  return new Uint8Array(result)
}

// ===== 编码修复核心函数 =====

/**
 * 执行一次编码转换修复
 * @param garbledText 乱码文本
 * @param wrongEncoding 当前文本被错误使用解码的编码
 * @param correctEncoding 正确的原始编码
 * @returns 修复后的文本
 */
export function convertEncoding(
  garbledText: string,
  wrongEncoding: string,
  correctEncoding: string,
): string {
  try {
    // Step 1: 用错误编码"反向编码"得到原始字节
    const bytes = encodeAsBytes(garbledText, wrongEncoding)

    // Step 2: 用正确编码解码字节
    const decoder = new TextDecoder(correctEncoding, { fatal: false })
    return decoder.decode(bytes)
  } catch {
    return garbledText
  }
}

/**
 * 定义所有尝试的修复路径
 */
export interface FixPath {
  wrong: string
  correct: string
  label: string
}

export const FIX_PATHS: FixPath[] = [
  { wrong: 'latin1', correct: 'utf-8', label: 'Latin-1 → UTF-8' },
  { wrong: 'windows-1252', correct: 'utf-8', label: 'Windows-1252 → UTF-8' },
  { wrong: 'gbk', correct: 'utf-8', label: 'GBK → UTF-8' },
  { wrong: 'shift-jis', correct: 'utf-8', label: 'Shift_JIS → UTF-8' },
  { wrong: 'euc-kr', correct: 'utf-8', label: 'EUC-KR → UTF-8' },
  { wrong: 'big5', correct: 'utf-8', label: 'Big5 → UTF-8' },
  { wrong: 'utf-8', correct: 'gbk', label: 'UTF-8 → GBK' },
  { wrong: 'utf-8', correct: 'shift-jis', label: 'UTF-8 → Shift_JIS' },
  { wrong: 'utf-8', correct: 'euc-kr', label: 'UTF-8 → EUC-KR' },
  { wrong: 'utf-8', correct: 'big5', label: 'UTF-8 → Big5' },
  { wrong: 'utf-8', correct: 'latin1', label: 'UTF-8 → Latin-1' },
]

// ===== 自动检测与评分 =====

/** 候选修复结果 */
export interface FixCandidate {
  path: FixPath
  result: string
  score: number
}

/** Unicode 字符范围检测 */
function isCJK(code: number): boolean {
  return (
    (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4DBF) || // CJK Extension A
    (code >= 0x20000 && code <= 0x2A6DF) || // CJK Extension B
    (code >= 0x2A700 && code <= 0x2B73F) || // CJK Extension C
    (code >= 0x2B740 && code <= 0x2B81F) || // CJK Extension D
    (code >= 0x2B820 && code <= 0x2CEAF) || // CJK Extension E
    (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
    (code >= 0x2F800 && code <= 0x2FA1F) // CJK Compatibility Supplement
  )
}

function isJapaneseKana(code: number): boolean {
  return (
    (code >= 0x3040 && code <= 0x309F) || // Hiragana
    (code >= 0x30A0 && code <= 0x30FF) || // Katakana
    (code >= 0xFF66 && code <= 0xFF9F) || // Half-width Katakana
    (code >= 0x31F0 && code <= 0x31FF) // Katakana Phonetic Extensions
  )
}

function isKorean(code: number): boolean {
  return (
    (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
    (code >= 0x1100 && code <= 0x11FF) || // Hangul Jamo
    (code >= 0x3130 && code <= 0x318F) || // Hangul Compatibility Jamo
    (code >= 0xA960 && code <= 0xA97F) || // Hangul Jamo Extended-A
    (code >= 0xD7B0 && code <= 0xD7FF) // Hangul Jamo Extended-B
  )
}

function isLatin1Supplement(code: number): boolean {
  return code >= 0x0080 && code <= 0x00FF
}

function isWindows1252Ext(code: number): boolean {
  return code >= 0x20AC && code <= 0x017E
}

function isReplacementChar(code: number): boolean {
  return code === 0xFFFD // U+FFFD replacement character
}

/**
 * 对修复结果进行评分，分值越高表示越可能是正确的修复
 * 评分策略：
 *   - 惩罚替换字符（U+FFFD）
 *   - 奖励高密度 CJK / 日文假名 / 韩文音节
 *   - 如果修复前后完全相同，大幅降分
 */
function scoreResult(result: string, original: string): number {
  if (!result || result === original) return -1000

  const len = result.length
  if (len === 0) return -100

  let cjkCount = 0
  let kanaCount = 0
  let koreanCount = 0
  let replacementCount = 0
  let asciiCount = 0
  let latin1Count = 0
  let printAsciiCount = 0

  for (const char of result) {
    const cp = char.charCodeAt(0)

    if (isReplacementChar(cp)) {
      replacementCount++
    } else if (isCJK(cp)) {
      cjkCount++
    } else if (isJapaneseKana(cp)) {
      kanaCount++
    } else if (isKorean(cp)) {
      koreanCount++
    } else if (isLatin1Supplement(cp)) {
      latin1Count++
    } else if (cp >= 0x20 && cp <= 0x7E) {
      printAsciiCount++
    } else if (cp >= 0 && cp <= 0x7F) {
      asciiCount++
    }
  }

  // 替换字符占比 — 越少越好
  const replacementRatio = replacementCount / len

  // 有效字符（非替换字符）占比
  const validRatio = 1 - replacementRatio

  // 东亚字符（CJK + 假名 + 韩文）占比
  const eastAsianCount = cjkCount + kanaCount + koreanCount
  const eastAsianRatio = eastAsianCount / len

  // 可打印 ASCII 占比
  const printableAsciiRatio = printAsciiCount / len

  // 核心评分：高有效字符 + 高东亚字符 = 很好
  // 如果结果主要是可读文本，加分
  let score = 0

  // 替换字符惩罚
  score -= replacementRatio * 500

  // 东亚字符奖励（高权重，表示结果是可读的中日韩）
  score += eastAsianRatio * 300

  // 如果是纯 ASCII（英数符号），也给予一定分数
  if (printableAsciiRatio > 0.5 && replacementRatio < 0.1) {
    score += printableAsciiRatio * 100
  }

  // 有效字符加分
  score += validRatio * 200

  // Latin-1 补充字符出现在修复结果中通常是错误的
  score -= latin1Count * 5

  return score
}

/**
 * 构建并缓存所有编码映射表
 */
function ensureAllMapsBuilt(): void {
  for (const encoding of Object.keys(encodingMaps)) {
    buildEncodingMap(encoding)
  }
}

/**
 * 自动检测并修复编码乱码
 * @param garbledText 乱码文本
 * @returns 候选列表（按评分降序）
 */
export function autoFixEncoding(garbledText: string): FixCandidate[] {
  if (!garbledText) return []

  // 确保编码映射表已构建
  ensureAllMapsBuilt()

  const candidates: FixCandidate[] = []

  for (const path of FIX_PATHS) {
    try {
      const result = convertEncoding(garbledText, path.wrong, path.correct)
      const score = scoreResult(result, garbledText)
      if (score > -100) {
        candidates.push({ path, result, score })
      }
    } catch {
      // skip failed conversions
    }
  }

  // 按评分降序排列
  candidates.sort((a, b) => b.score - a.score)

  return candidates
}

/**
 * 获取所有支持的编码列表
 */
export function getSupportedEncodings(): { value: string; label: string }[] {
  return [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'gbk', label: 'GBK' },
    { value: 'big5', label: 'Big5 (繁体中文)' },
    { value: 'shift-jis', label: 'Shift_JIS (日文)' },
    { value: 'euc-kr', label: 'EUC-KR (韩文)' },
    { value: 'latin1', label: 'Latin-1 (ISO-8859-1)' },
    { value: 'windows-1252', label: 'Windows-1252' },
  ]
}

/**
 * 判断文本是否明显为乱码
 * 适用于 UI 上提前提示用户
 */
export function isTextGarbled(text: string): { garbled: boolean; reason: string } {
  if (!text) return { garbled: false, reason: '' }

  const len = text.length
  if (len === 0) return { garbled: false, reason: '' }

  let replacementCount = 0
  let highAsciiCount = 0
  let asciiCount = 0

  for (const char of text) {
    const cp = char.charCodeAt(0)
    if (isReplacementChar(cp)) {
      replacementCount++
    } else if (cp > 0x7F && cp < 0x4E00) {
      // High ASCII but not CJK range — could be Latin-1 accented chars
      highAsciiCount++
    } else if (cp <= 0x7F) {
      asciiCount++
    }
  }

  // 替换字符
  if (replacementCount > len * 0.1) {
    return { garbled: true, reason: '包含大量替换字符（�），可能是编码不兼容导致' }
  }

  // 如果大量字符是 Latin-1 补充字符而几乎无 C/J/K，可能是 UTF-8→Latin-1 乱码
  if (highAsciiCount > len * 0.4 && asciiCount < len * 0.3) {
    return { garbled: true, reason: '检测到大量扩展拉丁字符，可能是 UTF-8 被误解码为单字节编码' }
  }

  return { garbled: false, reason: '' }
}
