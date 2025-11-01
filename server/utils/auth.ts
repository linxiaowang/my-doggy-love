import crypto from 'node:crypto'
import { H3Event, getCookie, setCookie } from 'h3'

const AUTH_COOKIE = 'mdl_token'

function getSecret(): string {
  return process.env.AUTH_SECRET || 'dev-secret'
}

export interface AuthTokenPayload {
  userId: string
  iat: number
}

export function hashPassword(password: string): string {
  const salt = 'mdl_salt'
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export function signToken(payload: AuthTokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
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
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as AuthTokenPayload
    return payload
  } catch {
    return null
  }
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, AUTH_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/' })
}

export function readAuthFromCookie(event: H3Event): AuthTokenPayload | null {
  const token = getCookie(event, AUTH_COOKIE)
  if (!token) return null
  return verifyToken(token)
}


