import { defineEventHandler, createError } from 'h3'
import prisma from '../../../utils/db'
import { readAuthFromCookie } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const post = await prisma.dailyPost.findUnique({ where: { id } })
  if (!post) throw createError({ statusCode: 404, statusMessage: 'post not found' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })

  const all = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'asc' },
    include: { author: true },
  })

  const byId: Record<string, any> = {}
  const roots: any[] = []
  for (const c of all as any[]) {
    byId[c.id] = {
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { id: c.author.id, nickName: c.author.nickName, avatarUrl: c.author.avatarUrl },
      replies: [] as any[],
      parentId: c.parentId,
    }
  }
  for (const c of Object.values(byId)) {
    if (c.parentId && byId[c.parentId]) byId[c.parentId].replies.push(c)
    else roots.push(c)
  }
  return { items: roots }
})


