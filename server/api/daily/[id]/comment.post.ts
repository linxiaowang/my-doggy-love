import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../utils/db'
import { readAuthFromCookie } from '../../../utils/auth'
import { createNotification } from '../../../utils/notifications'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const body = await readBody<{ content: string }>(event)
  const content = body?.content?.trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: 'content required' })

  const post = await prisma.dailyPost.findUnique({ where: { id }, include: { author: true } })
  if (!post) throw createError({ statusCode: 404, statusMessage: 'post not found' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })

  const c = await prisma.comment.create({ data: { postId: id, authorId: payload.userId, content } })
  
  // 如果不是作者自己评论，创建通知给日常作者
  if (post.authorId !== payload.userId) {
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } })
    await createNotification({
      userId: post.authorId,
      type: 'daily_comment',
      relatedId: c.id,
      content: `${currentUser?.nickName || 'TA'} 评论了你的日常记录`,
    })
  }
  
  return { id: c.id }
})


