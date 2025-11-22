import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { endpoint } = body

  if (!endpoint) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid endpoint' })
  }

  await prisma.pushSubscription.deleteMany({
    where: {
      userId: payload.userId,
      endpoint: endpoint
    }
  })

  return { success: true }
})
