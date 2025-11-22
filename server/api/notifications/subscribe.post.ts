import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { subscription } = body

  if (!subscription || !subscription.endpoint) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid subscription' })
  }

  // 检查是否已存在相同的 endpoint，避免重复
  const existing = await prisma.pushSubscription.findFirst({
    where: {
      userId: payload.userId,
      endpoint: subscription.endpoint
    }
  })

  if (existing) {
    // 更新 keys
    await prisma.pushSubscription.update({
      where: { id: existing.id },
      data: { keys: subscription.keys }
    })
  } else {
    await prisma.pushSubscription.create({
      data: {
        userId: payload.userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
    })
  }

  return { success: true }
})
