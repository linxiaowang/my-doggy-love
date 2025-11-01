import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const body = await readBody<{ code: string }>(event)
  const code = body?.code?.trim().toUpperCase()
  if (!code) throw createError({ statusCode: 400, statusMessage: 'code required' })

  const target = await prisma.couple.findUnique({ where: { code } })
  if (!target) throw createError({ statusCode: 404, statusMessage: 'target couple not found' })

  const currentMembership = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })

  // If already in target couple, nothing to do
  if (currentMembership && currentMembership.coupleId === target.id)
    return { couple: { id: target.id, code: target.code } }

  // Switch: leave current couple if exists, then join target couple
  await prisma.$transaction(async (tx) => {
    if (currentMembership) {
      const currentCoupleId = currentMembership.coupleId
      await tx.coupleMember.delete({ where: { id: currentMembership.id } })
      const leftCount = await tx.coupleMember.count({ where: { coupleId: currentCoupleId } })
      if (leftCount === 0) {
        // 仅在没有任何关联记录时删除情侣，避免外键冲突
        const relatedCounts = await Promise.all([
          tx.dailyPost.count({ where: { coupleId: currentCoupleId } }),
          tx.wish.count({ where: { coupleId: currentCoupleId } }),
          tx.message.count({ where: { coupleId: currentCoupleId } }),
          tx.anniversary.count({ where: { coupleId: currentCoupleId } }),
        ])
        const hasRelated = relatedCounts.some(c => c > 0)
        if (!hasRelated) {
          await tx.couple.delete({ where: { id: currentCoupleId } })
        }
      }
    }

    // Join target couple as role B if another member exists, else A
    const memberCount = await tx.coupleMember.count({ where: { coupleId: target.id } })
    const role = memberCount === 0 ? 'A' : 'B'
    await tx.coupleMember.create({ data: { userId: payload.userId, coupleId: target.id, role } })
  })

  return { couple: { id: target.id, code: target.code } }
})


