import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { hashPassword, signToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      email?: string
      password?: string
      nickName: string
    }>(event)

    const nickName = body?.nickName?.trim()
    if (!nickName) throw createError({ statusCode: 400, statusMessage: 'nickName required' })

    let email: string | undefined
    if (body?.email) email = body.email.trim().toLowerCase()
    let passwordHash: string | undefined
    if (body?.password) passwordHash = hashPassword(body.password)

    if (email) {
      const existed = await prisma.user.findUnique({ where: { email } })
      if (existed) throw createError({ statusCode: 409, statusMessage: 'email exists' })
    }

    const user = await prisma.user.create({ data: { email, passwordHash, nickName } })
    const token = signToken({ userId: user.id, iat: Date.now() })
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


