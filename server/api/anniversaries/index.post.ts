import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) throw createError({ statusCode: 400, statusMessage: 'not in couple' })
  const body = await readBody<{ title: string; date: string; coverUrl?: string }>(event)
  const title = body?.title?.trim()
  const date = body?.date
  if (!title || !date) throw createError({ statusCode: 400, statusMessage: 'title/date required' })
  const a = await prisma.anniversary.create({ data: { coupleId: member.coupleId, title, date: new Date(date), coverUrl: body?.coverUrl } })
  return { id: a.id }
})


