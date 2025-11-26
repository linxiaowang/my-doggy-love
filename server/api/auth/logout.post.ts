import { defineEventHandler } from 'h3'
import { setCookie } from 'h3'
import { readAuthFromCookie } from '../../utils/auth'
import prisma from '../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  
  // 如果 token 包含 sessionId，删除对应的 session 记录
  if (payload?.sessionId) {
    try {
      await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => {
        // 如果 session 不存在，忽略错误
      })
    } catch {
      // 忽略删除错误
    }
  }
  
  setCookie(event, 'mdl_token', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return { ok: true }
})


