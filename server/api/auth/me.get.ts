import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { user: null }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return { user: null }
  return {
    user: {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      statusUpdatedAt: user.statusUpdatedAt,
    },
  }
})


