import { defineEventHandler, getQuery, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  
  const query = getQuery(event)
  const take = Math.min(parseInt(String(query.take || '20')), 50)
  const cursor = query.cursor ? { id: String(query.cursor) } : undefined
  const unreadOnly = query.unreadOnly === 'true'

  const where: any = {
    userId: payload.userId,
  }
  
  if (unreadOnly) {
    where.read = false
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor } : {}),
  })

  return { items: notifications }
})

