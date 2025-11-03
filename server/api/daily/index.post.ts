import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createNotification, getPartner } from '../../utils/notifications'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) throw createError({ statusCode: 400, statusMessage: 'not in couple' })

  const body = await readBody<{ content: string; mediaUrls?: string[]; tags?: string[] }>(event)
  const content = body?.content?.trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: 'content required' })

  const post = await prisma.dailyPost.create({
    data: {
      coupleId: member.coupleId,
      authorId: payload.userId,
      content,
      mediaUrls: body?.mediaUrls || [],
      tags: body?.tags || []
    }
  })
  
  // 创建通知给另一个成员
  const partner = await getPartner(member.coupleId, payload.userId)
  if (partner) {
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } })
    await createNotification({
      userId: partner.id,
      type: 'daily_posted',
      relatedId: post.id,
      content: `${currentUser?.nickName || 'TA'} 发表了新的日常记录`,
    })
  }
  
  return { id: post.id }
})


