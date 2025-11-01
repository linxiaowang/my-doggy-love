import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { hashPassword, signToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
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
})


