/**
 * 日期时间转换工具核心逻辑
 * 抽离为纯函数，便于单元测试且组件与测试共用同一实现
 */

export interface DateTimeResultItem {
  key: string
  label: string
  value: string
}

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const pad = (n: number): string => String(n).padStart(2, '0')

/**
 * 解析用户输入
 * - 纯数字：10 位及以下按秒级时间戳处理，11 位及以上按毫秒级处理
 * - 其他：按日期时间字符串解析，失败时兼容 "2024-01-01 12:00:00" 形式
 */
export function parseDateTimeInput(raw: string): Date | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed)
    const ms = trimmed.length <= 10 ? num * 1000 : num
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }

  let d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) {
    d = new Date(trimmed.replace(/-/g, '/'))
  }
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * 获取当前时区标签，如 UTC+08:00
 */
export function getTimezoneLabel(date: Date): string {
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const abs = Math.abs(offset)
  return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

/**
 * 将日期格式化为多种展示格式
 */
export function formatDateTime(date: Date): DateTimeResultItem[] {
  const localDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const localTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  const utcDate = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
  const utcTime = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`

  return [
    { key: 'local', label: '本地时间', value: `${localDate} ${localTime}` },
    { key: 'utc', label: 'UTC 时间', value: `${utcDate} ${utcTime}` },
    { key: 'iso', label: 'ISO 8601', value: date.toISOString() },
    { key: 'ts-sec', label: '时间戳（秒）', value: String(Math.floor(date.getTime() / 1000)) },
    { key: 'ts-ms', label: '时间戳（毫秒）', value: String(date.getTime()) },
    { key: 'date', label: '日期', value: localDate },
    { key: 'time', label: '时间', value: localTime },
    { key: 'weekday', label: '星期', value: WEEKDAYS[date.getDay()] },
    { key: 'tz', label: '时区', value: getTimezoneLabel(date) },
  ]
}
