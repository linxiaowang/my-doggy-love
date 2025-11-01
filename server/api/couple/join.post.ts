import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const body = await readBody<{ code: string }>(event)
  const code = body?.code?.trim().toUpperCase()
  if (!code) throw createError({ statusCode: 400, statusMessage: 'code required' })

  const already = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (already) throw createError({ statusCode: 400, statusMessage: 'already in couple' })

  const couple = await prisma.couple.findUnique({ where: { code } })
  if (!couple) throw createError({ statusCode: 404, statusMessage: 'couple not found' })

  await prisma.coupleMember.create({ data: { userId: payload.userId, coupleId: couple.id, role: 'B' } })
  return { couple: { id: couple.id, code: couple.code } }
})


