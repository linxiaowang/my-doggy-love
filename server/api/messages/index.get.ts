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
  const mapped = await Promise.all(items.map(async (m) => {
    const count = await prisma.comment.count({ where: { messageId: m.id } })
    return {
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      commentCount: count,
      author: { 
        id: m.author.id, 
        nickName: m.author.nickName, 
        avatarUrl: m.author.avatarUrl 
          ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(m.author.avatarUrl) : m.author.avatarUrl)
          : null
      },
    }
  }))
  return { items: mapped }
})


