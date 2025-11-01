import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) throw createError({ statusCode: 400, statusMessage: 'not in couple' })
  const body = await readBody<{ title: string; description?: string }>(event)
  const title = body?.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title required' })
  const w = await prisma.wish.create({ data: { coupleId: member.coupleId, title, description: body?.description } })
  return { id: w.id }
})


