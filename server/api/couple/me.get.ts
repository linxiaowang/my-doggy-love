import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { couple: null }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member) return { couple: null }
  const couple = await prisma.couple.findUnique({ where: { id: member.coupleId } })
  if (!couple) return { couple: null }
  const members = await prisma.coupleMember.findMany({ where: { coupleId: couple.id }, include: { user: true } })
  
  const storage = createStorageService()
  return {
    couple: {
      id: couple.id,
      code: couple.code,
      members: members.map(m => ({
        id: m.user.id,
        nickName: m.user.nickName,
        avatarUrl: m.user.avatarUrl 
          ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(m.user.avatarUrl) : m.user.avatarUrl)
          : null,
        role: m.role
      }))
    }
  }
})


