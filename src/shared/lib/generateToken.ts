/**
 * 가상의 UUID 토큰을 생성합니다.
 * MSW 핸들러에서 사용됩니다.
 */
export const generateToken = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}