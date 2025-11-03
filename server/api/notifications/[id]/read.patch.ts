import { defineEventHandler, createError } from 'h3'
import prisma from '../../../utils/db'
import { readAuthFromCookie } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  
  const id = event.context.params?.id as string
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const notification = await prisma.notification.findUnique({
    where: { id },
  })

  if (!notification) {
    throw createError({ statusCode: 404, statusMessage: 'notification not found' })
  }

  if (notification.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true },
  })

  return { id: updated.id }
})

