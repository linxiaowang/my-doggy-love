import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { items: [] }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) return { items: [] }
  const items = await prisma.wish.findMany({ where: { coupleId: member.coupleId }, orderBy: { createdAt: 'desc' } })
  return { items }
})


