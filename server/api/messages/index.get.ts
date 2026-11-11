import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { items: [], nextCursor: null }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) return { items: [], nextCursor: null }

  const query = getQuery(event)
  const take = Math.min(Math.max(parseInt(String(query.take || '20'), 10) || 20, 1), 50)
  const cursorId = query.cursor ? String(query.cursor) : undefined

  const items = await prisma.message.findMany({
    where: { coupleId: member.coupleId },
    orderBy: { createdAt: 'desc' },
    take: take + 1, // 多取一条判断是否还有下一页
    ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
    include: { author: true },
  })

  const hasMore = items.length > take
  const page = hasMore ? items.slice(0, take) : items
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null

  const storage = createStorageService()
  const mapped = await Promise.all(page.map(async (m) => {
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
          : null,
      },
    }
  }))

  return { items: mapped, nextCursor }
})
