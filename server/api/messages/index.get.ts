import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { items: [] }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) return { items: [] }
  
  const storage = createStorageService()
  const items = await prisma.message.findMany({
    where: { coupleId: member.coupleId },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
  return {
    items: items.map(m => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      author: { 
        id: m.author.id, 
        nickName: m.author.nickName, 
        avatarUrl: m.author.avatarUrl 
          ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(m.author.avatarUrl) : m.author.avatarUrl)
          : null
      },
    }))
  }
})


