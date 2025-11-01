import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../../utils/db'
import { readAuthFromCookie } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const commentId = event.context.params?.commentId as string
  const body = await readBody<{ content: string }>(event)
  const content = body?.content?.trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: 'content required' })

  const parent = await prisma.comment.findUnique({ where: { id: commentId }, include: { post: true } as any })
  if (!parent) throw createError({ statusCode: 404, statusMessage: 'comment not found' })

  // 权限：需同一个 couple
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  if (parent.postId) {
    const post = await prisma.dailyPost.findUnique({ where: { id: parent.postId } })
    if (!post || post.coupleId !== member.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  }

  const c = await prisma.comment.create({ data: { parentId: commentId, authorId: payload.userId, content, postId: parent.postId } as any })
  return { id: c.id }
})


