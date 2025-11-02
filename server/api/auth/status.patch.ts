import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const body = await readBody<{ status?: string | null }>(event)
  
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      status: body.status || null,
      statusUpdatedAt: body.status ? new Date() : null,
    },
  })

  return {
    status: user.status,
    statusUpdatedAt: user.statusUpdatedAt,
  }
})

