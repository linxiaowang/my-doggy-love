import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { hashPassword, signToken, setAuthCookie, getDeviceInfo, TOKEN_EXPIRY_SECONDS } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      email: string
      password: string
      nickName?: string
    }>(event)

    const email = body?.email?.trim().toLowerCase()
    const password = body?.password
    const nickNameInput = body?.nickName?.trim()

    // 必须提供邮箱和密码
    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: '邮箱和密码都是必需的' })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({ statusCode: 400, statusMessage: '邮箱格式不正确' })
    }

    // 验证密码长度（至少6位）
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: '密码长度至少需要6位' })
    }

    // 检查邮箱是否已存在
    const existed = await prisma.user.findUnique({ where: { email } })
    if (existed) {
      throw createError({ statusCode: 409, statusMessage: '该邮箱已被注册' })
    }

    // 如果未提供昵称，从邮箱自动生成（取@前的部分）
    const nickName = nickNameInput || email.split('@')[0]

    const passwordHash = hashPassword(password)
    const user = await prisma.user.create({ data: { email, passwordHash, nickName } })
    
    // 获取设备信息并创建 session 记录，支持多设备登录
    const { userAgent, ipAddress, deviceInfo } = getDeviceInfo(event)
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
  } catch (error: any) {
    // 处理 Prisma 数据库错误
    if (error?.code === 'P1000' || error?.code === 'P1001') {
      throw createError({ 
        statusCode: 503, 
        statusMessage: 'Database connection failed. Please check database configuration.' 
      })
    }
    // 重新抛出其他已知错误
    if (error?.statusCode) {
      throw error
    }
    // 其他未知错误
    console.error('Register API error:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: error?.message || 'Internal server error' 
    })
  }
})


