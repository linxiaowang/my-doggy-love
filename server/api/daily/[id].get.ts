import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const post = await prisma.dailyPost.findUnique({ where: { id } })
  if (!post) return { item: null }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  return { item: post }
})


