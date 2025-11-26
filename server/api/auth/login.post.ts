import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { hashPassword, signToken, setAuthCookie, getDeviceInfo, TOKEN_EXPIRY_SECONDS } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password

  // 必须提供邮箱和密码
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: '邮箱和密码都是必需的' })
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: '邮箱格式不正确' })
  }

  // 查找用户并验证密码
  const passwordHash = hashPassword(password)
  const user = await prisma.user.findFirst({ where: { email, passwordHash } })
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '邮箱或密码错误' })
  }

  // 获取设备信息
  const { userAgent, ipAddress, deviceInfo } = getDeviceInfo(event)
  
  // 创建 session 记录，支持多设备登录
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_SECONDS * 1000)
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      deviceInfo,
      userAgent,
      ipAddress,
      expiresAt,
    },
  })

  // 在 token 中包含 sessionId
  const token = signToken({ userId: user.id, sessionId: session.id, iat: Date.now() })
  setAuthCookie(event, token)
  return { user: { id: user.id, email: user.email, nickName: user.nickName, avatarUrl: user.avatarUrl } }
})


