import { describe, it, expect } from 'vitest'
import { validPhoneNumber, validEmail, validIdCard } from '@/utils/user_info_utils'

describe('user_info_utils', () => {
  describe('validPhoneNumber', () => {
    it('有效手机号', () => {
      expect(validPhoneNumber('13800138000')).toBe(true)
      expect(validPhoneNumber('15012345678')).toBe(true)
      expect(validPhoneNumber('19876543210')).toBe(true)
      expect(validPhoneNumber('17612345678')).toBe(true)
    })

    it('无效手机号 - 非1开头', () => {
      expect(validPhoneNumber('23800138000')).toBe(false)
      expect(validPhoneNumber('0138001380')).toBe(false)
    })

    it('无效手机号 - 第二位不在3456789', () => {
      expect(validPhoneNumber('12012345678')).toBe(false)
      expect(validPhoneNumber('11012345678')).toBe(false)
    })

    it('无效手机号 - 长度不对', () => {
      expect(validPhoneNumber('1380013800')).toBe(false) // 10位
      expect(validPhoneNumber('138001380000')).toBe(false) // 12位
    })

    it('无效手机号 - 空字符串', () => {
      expect(validPhoneNumber('')).toBe(false)
    })

    it('无效手机号 - 含非数字字符', () => {
      expect(validPhoneNumber('138-00138000')).toBe(false)
      expect(validPhoneNumber('1380013800a')).toBe(false)
    })
  })

  describe('validEmail', () => {
    // 正则: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    // 用户名部分只允许字母、数字、下划线、减号，不允许点号
    it('有效邮箱 - 简单格式', () => {
      expect(validEmail('test@example.com')).toBe(true)
      expect(validEmail('a_b-c@test.org')).toBe(true)
      expect(validEmail('name@sub.domain.com')).toBe(true)
      expect(validEmail('user123@domain.co')).toBe(true)
    })

    it('无效邮箱 - 用户名含点号（正则不支持）', () => {
      expect(validEmail('user.name@domain.co')).toBe(false) // . 不在 [a-zA-Z0-9_-] 中
    })

    it('无效邮箱 - 缺少 @', () => {
      expect(validEmail('testexample.com')).toBe(false)
    })

    it('无效邮箱 - 缺少域名', () => {
      expect(validEmail('test@')).toBe(false)
      expect(validEmail('test@.com')).toBe(false)
    })

    it('无效邮箱 - 缺少用户名', () => {
      expect(validEmail('@example.com')).toBe(false)
    })

    it('无效邮箱 - 空字符串', () => {
      expect(validEmail('')).toBe(false)
    })

    it('无效邮箱 - 多个 @', () => {
      expect(validEmail('test@@example.com')).toBe(false)
    })

    it('无效邮箱 - 只有一个域名段', () => {
      expect(validEmail('test@localhost')).toBe(false) // 无 .xxx 后缀
    })
  })

  describe('validIdCard', () => {
    it('有效15位身份证', () => {
      expect(validIdCard('123456789012345')).toBe(true)
    })

    it('有效18位身份证', () => {
      expect(validIdCard('123456789012345678')).toBe(true)
    })

    it('有效18位身份证 - 最后一位X', () => {
      expect(validIdCard('12345678901234567X')).toBe(true)
    })

    it('有效18位身份证 - 最后一位x', () => {
      expect(validIdCard('12345678901234567x')).toBe(true)
    })

    it('无效身份证 - 长度不对', () => {
      expect(validIdCard('12345678901234')).toBe(false) // 14位
      expect(validIdCard('12345678901234567')).toBe(false) // 17位
      expect(validIdCard('1234567890123456789')).toBe(false) // 19位
    })

    it('无效身份证 - 空字符串', () => {
      expect(validIdCard('')).toBe(false)
    })

    it('无效身份证 - 16位', () => {
      expect(validIdCard('1234567890123456')).toBe(false)
    })
  })
})