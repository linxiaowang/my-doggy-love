import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  await prisma.notification.updateMany({
    where: {
      userId: payload.userId,
      read: false,
    },
    data: {
      read: true,
    },
  })

  return { success: true }
})

