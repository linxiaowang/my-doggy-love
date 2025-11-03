import { defineEventHandler, getQuery } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

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
    ...(cursor ? { skip: 1, cursor } : {}),
    include: { author: true }
  })

  const storage = createStorageService()
  // 转换 mediaUrls 中的每个 URL
  const processedItems = await Promise.all(items.map(async (item) => {
    const mediaUrls = Array.isArray(item.mediaUrls) ? item.mediaUrls : []
    const convertedUrls = mediaUrls.map((url: any) => {
      const urlStr = String(url)
      return storage.toAccessibleUrl ? storage.toAccessibleUrl(urlStr) : urlStr
    })
    // 统计评论总数（包含回复）
    const commentCount = await prisma.comment.count({ where: { postId: item.id } })
    return {
      ...item,
      mediaUrls: convertedUrls,
      commentCount,
      author: {
        id: item.author.id,
        nickName: item.author.nickName,
        avatarUrl: item.author.avatarUrl 
          ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(item.author.avatarUrl) : item.author.avatarUrl)
          : null
      }
    }
  }))

  return { items: processedItems }
})


