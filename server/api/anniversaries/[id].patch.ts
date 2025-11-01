import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const body = await readBody<{ title?: string; date?: string; coverUrl?: string | null }>(event)
  const data: any = {}
  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.coverUrl !== 'undefined') data.coverUrl = body.coverUrl
  if (typeof body.date === 'string') data.date = new Date(body.date)

  const a = await prisma.anniversary.update({ where: { id }, data })
  return { id: a.id }
})


