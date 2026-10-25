import { describe, it, expect } from 'vitest'
import {
  formatDateTime,
  getTimezoneLabel,
  parseDateTimeInput,
} from '@/utils/Tools/datetime_utils'

describe('日期时间转换核心逻辑', () => {
  describe('parseDateTimeInput - 时间戳解析', () => {
    it('10 位数字按秒级时间戳解析', () => {
      const date = parseDateTimeInput('1700000000')
      expect(date).not.toBeNull()
      expect(date!.getTime()).toBe(1700000000000)
    })

    it('13 位数字按毫秒级时间戳解析', () => {
      const date = parseDateTimeInput('1700000000000')
      expect(date).not.toBeNull()
      expect(date!.getTime()).toBe(1700000000000)
    })

    it('11 位及以上数字按毫秒级时间戳解析', () => {
      const date = parseDateTimeInput('17000000000')
      expect(date!.getTime()).toBe(17000000000)
    })

    it('0 时间戳解析为 1970-01-01T00:00:00.000Z', () => {
      expect(parseDateTimeInput('0')!.toISOString()).toBe('1970-01-01T00:00:00.000Z')
    })

    it('秒级与毫秒级相同时间得到一致结果', () => {
      expect(parseDateTimeInput('1700000000')!.getTime()).toBe(
        parseDateTimeInput('1700000000000')!.getTime(),
      )
    })
  })

  describe('parseDateTimeInput - 日期字符串解析', () => {
    it('解析 ISO 8601 字符串', () => {
      const date = parseDateTimeInput('2024-01-01T00:00:00.000Z')
      expect(date!.toISOString()).toBe('2024-01-01T00:00:00.000Z')
    })

    it('解析 "YYYY-MM-DD HH:mm:ss" 格式', () => {
      const date = parseDateTimeInput('2024-01-01 12:30:45')
      expect(date).not.toBeNull()
      expect(date!.getFullYear()).toBe(2024)
      expect(date!.getMonth()).toBe(0)
      expect(date!.getDate()).toBe(1)
    })

    it('解析纯日期 "YYYY-MM-DD"', () => {
      const date = parseDateTimeInput('2024-06-15')
      expect(date!.getFullYear()).toBe(2024)
      expect(date!.getMonth()).toBe(5)
      expect(date!.getDate()).toBe(15)
    })

    it('忽略首尾空白', () => {
      expect(parseDateTimeInput('  1700000000  ')!.getTime()).toBe(1700000000000)
    })
  })

  describe('parseDateTimeInput - 无效输入', () => {
    it('空字符串返回 null', () => {
      expect(parseDateTimeInput('')).toBeNull()
    })

    it('纯空白返回 null', () => {
      expect(parseDateTimeInput('   ')).toBeNull()
    })

    it('无法识别的文本返回 null', () => {
      expect(parseDateTimeInput('not a date')).toBeNull()
    })

    it('非法日期字符串返回 null', () => {
      expect(parseDateTimeInput('2024-13-45 99:99:99')).toBeNull()
    })
  })

  describe('getTimezoneLabel', () => {
    it('返回 UTC±HH:mm 格式', () => {
      const label = getTimezoneLabel(new Date())
      expect(label).toMatch(/^UTC[+-]\d{2}:\d{2}$/)
    })

    it('偏移量与 getTimezoneOffset 一致', () => {
      const date = new Date()
      const offsetMinutes = -date.getTimezoneOffset()
      const sign = offsetMinutes >= 0 ? '+' : '-'
      const abs = Math.abs(offsetMinutes)
      const expected = `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(
        abs % 60,
      ).padStart(2, '0')}`
      expect(getTimezoneLabel(date)).toBe(expected)
    })
  })

  describe('formatDateTime - 格式化结果', () => {
    // 使用本地时间构造函数，避免测试环境时区影响
    const localDate = new Date(2024, 0, 1, 9, 5, 3)
    const results = formatDateTime(localDate)
    const getValue = (key: string) => results.find((item) => item.key === key)?.value

    it('返回全部 9 个格式项', () => {
      expect(results.map((item) => item.key)).toEqual([
        'local',
        'utc',
        'iso',
        'ts-sec',
        'ts-ms',
        'date',
        'time',
        'weekday',
        'tz',
      ])
    })

    it('本地时间格式为 YYYY-MM-DD HH:mm:ss', () => {
      expect(getValue('local')).toBe('2024-01-01 09:05:03')
    })

    it('日期与时间字段正确', () => {
      expect(getValue('date')).toBe('2024-01-01')
      expect(getValue('time')).toBe('09:05:03')
    })

    it('星期计算正确（2024-01-01 为星期一）', () => {
      expect(getValue('weekday')).toBe('星期一')
    })

    it('ISO 8601 与 Date.toISOString() 一致', () => {
      expect(getValue('iso')).toBe(localDate.toISOString())
    })

    it('秒级与毫秒级时间戳正确', () => {
      expect(getValue('ts-sec')).toBe(String(Math.floor(localDate.getTime() / 1000)))
      expect(getValue('ts-ms')).toBe(String(localDate.getTime()))
    })

    it('UTC 时间字段正确', () => {
      const utcDate = new Date(Date.UTC(2024, 0, 1, 9, 5, 3))
      const utcResults = formatDateTime(utcDate)
      expect(utcResults.find((item) => item.key === 'utc')?.value).toBe('2024-01-01 09:05:03')
    })

    it('时区字段为 UTC±HH:mm 格式', () => {
      expect(getValue('tz')).toMatch(/^UTC[+-]\d{2}:\d{2}$/)
    })
  })
})
