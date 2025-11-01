import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../utils/db'
import { readAuthFromCookie } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const body = await readBody<{ content: string }>(event)
  const content = body?.content?.trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: 'content required' })

  const msg = await prisma.message.findUnique({ where: { id } })
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'message not found' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== msg.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })

  const c = await prisma.comment.create({ data: { messageId: id, authorId: payload.userId, content } })
  return { id: c.id }
})

