import crypto from 'node:crypto'
import { H3Event, getCookie, setCookie } from 'h3'

const AUTH_COOKIE = 'mdl_token'

function getSecret(): string {
  return process.env.AUTH_SECRET || 'dev-secret'
}

export interface AuthTokenPayload {
  userId: string
  coupleId?: string // 情侣 ID，用于情侣会话权限验证
  sessionId?: string // 会话 ID，用于多设备管理
  iat: number
  exp?: number // 过期时间（Unix 时间戳）
}

// Token 有效期：永久有效（设置为 10 年，实际上不会过期）
// 这样登录状态可以像 app 一样永久保持
export const TOKEN_EXPIRY_SECONDS = 10 * 365 * 24 * 60 * 60 // 10 年

export function hashPassword(password: string): string {
  const salt = 'mdl_salt'
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export function signToken(payload: AuthTokenPayload): string {
  // 如果没有设置过期时间，自动设置为 10 年后（永久有效）
  const now = Math.floor(Date.now() / 1000)
  const tokenPayload = {
    ...payload,
    exp: payload.exp || now + TOKEN_EXPIRY_SECONDS,
  }
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token: string): AuthTokenPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url')
  if (expected !== sig) return null
  try {
    const bodyStr = body ?? ''
    const payload = JSON.parse(Buffer.from(bodyStr, 'base64url').toString()) as AuthTokenPayload
    // 移除过期检查，实现永久登录（像 app 一样）
    // 只有在用户主动退出登录或 session 被删除时才会失效
    return payload
  } catch {
    return null
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  // 设置 cookie 过期时间为 10 年（永久有效），像 app 一样不会自动退出
  setCookie(event, AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_EXPIRY_SECONDS, // 10 年，实际上永久有效
  })
}

export function readAuthFromCookie(event: H3Event): AuthTokenPayload | null {
  const token = getCookie(event, AUTH_COOKIE)
  if (!token) return null
  return verifyToken(token)
}

/**
 * 检查 token 是否即将过期（7 天内过期）
 * 由于现在 token 是永久有效的，这个函数主要用于兼容性
 * 实际上不会返回 true（因为过期时间是 10 年后）
 */
export function isTokenExpiringSoon(payload: AuthTokenPayload | null): boolean {
  // Token 现在是永久有效的，不需要自动刷新
  // 但保留这个函数以保持接口兼容性
  return false
}

/**
 * 从请求中获取设备信息
 */
export function getDeviceInfo(event: H3Event): { userAgent: string; ipAddress: string; deviceInfo: string } {
  const headers = event.node.req.headers
  const userAgent = headers['user-agent'] || 'Unknown'
  const ipAddress = headers['x-forwarded-for']?.toString().split(',')[0] || 
                   headers['x-real-ip']?.toString() || 
                   event.node.req.socket.remoteAddress || 
                   'Unknown'
  
  // 简单的设备信息提取
  let deviceInfo = 'Unknown'
  if (userAgent.includes('Mobile')) {
    deviceInfo = 'Mobile'
  } else if (userAgent.includes('Tablet')) {
    deviceInfo = 'Tablet'
  } else {
    deviceInfo = 'Desktop'
  }
  
  return { userAgent, ipAddress, deviceInfo }
}


