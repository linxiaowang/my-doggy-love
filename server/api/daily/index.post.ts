import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

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
  return { id: post.id }
})


