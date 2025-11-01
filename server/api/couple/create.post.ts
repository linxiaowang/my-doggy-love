import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const existing = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (existing) throw createError({ statusCode: 400, statusMessage: 'already in couple' })

  let code = genCode()
  // 防撞码（简单重试）
  for (let i = 0; i < 3; i++) {
    const c = await prisma.couple.findUnique({ where: { code } })
    if (!c) break
    code = genCode()
  }

  const couple = await prisma.couple.create({ data: { code } })
  await prisma.coupleMember.create({ data: { userId: payload.userId, coupleId: couple.id, role: 'A' } })
  return { couple: { id: couple.id, code: couple.code } }
})


