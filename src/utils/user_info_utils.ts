export function validPhoneNumber(phone: string) {
  return /^1[3456789]\d{9}$/.test(phone)
}

export function validEmail(email: string) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

export function validIdCard(idCard: string) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}
