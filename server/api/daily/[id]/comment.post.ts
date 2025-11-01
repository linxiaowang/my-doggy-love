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

  const post = await prisma.dailyPost.findUnique({ where: { id } })
  if (!post) throw createError({ statusCode: 404, statusMessage: 'post not found' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })

  const c = await prisma.comment.create({ data: { postId: id, authorId: payload.userId, content } })
  return { id: c.id }
})


