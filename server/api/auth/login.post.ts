import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { hashPassword, signToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string; nickName?: string }>(event)
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password
  const nickName = body?.nickName?.trim()

  let user = null
  if (email && password) {
    const passwordHash = hashPassword(password)
    user = await prisma.user.findFirst({ where: { email, passwordHash } })
  } else if (nickName) {
    // 开发阶段：仅昵称登录（弱校验）
    user = await prisma.user.findFirst({ where: { nickName } })
  }
  if (!user) throw createError({ statusCode: 401, statusMessage: 'invalid credentials' })

  const token = signToken({ userId: user.id, iat: Date.now() })
  setAuthCookie(event, token)
  return { user: { id: user.id, email: user.email, nickName: user.nickName, avatarUrl: user.avatarUrl } }
})


