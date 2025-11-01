import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { items: [] }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) return { items: [] }

  const query = getQuery(event)
  const take = Math.min(parseInt(String(query.take || '20')), 50)
  const cursor = query.cursor ? { id: String(query.cursor) } : undefined

  const items = await prisma.dailyPost.findMany({
    where: { coupleId: member.coupleId },
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor } : {})
  })
  return { items }
})


