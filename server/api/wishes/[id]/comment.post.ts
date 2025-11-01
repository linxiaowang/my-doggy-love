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
  const w = await prisma.wish.findUnique({ where: { id } })
  if (!w) throw createError({ statusCode: 404, statusMessage: 'wish not found' })
  const c = await prisma.comment.create({ data: { wishId: id, authorId: payload.userId, content } })
  return { id: c.id }
})


