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

  const parent = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!parent) throw createError({ statusCode: 404, statusMessage: 'comment not found' })

  // 权限校验：与该留言属于同一 couple
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  if (parent.messageId) {
    const msg = await prisma.message.findUnique({ where: { id: parent.messageId } })
    if (!msg || msg.coupleId !== member.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  }

  const c = await prisma.comment.create({ data: { parentId: commentId, authorId: payload.userId, content, messageId: parent.messageId } as any })
  return { id: c.id }
})


