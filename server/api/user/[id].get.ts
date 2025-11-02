import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

/**
 * 获取用户信息（仅限情侣关系内的用户）
 */
export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  
  const userId = event.context.params?.id as string
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'user id required' })
  
  // 检查当前用户是否和查询用户在同一情侣关系中
  const currentMember = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!currentMember) throw createError({ statusCode: 403, statusMessage: 'not in couple' })
  
  const targetMember = await prisma.coupleMember.findFirst({ 
    where: { 
      userId,
      coupleId: currentMember.coupleId
    }
  })
  
  if (!targetMember) throw createError({ statusCode: 403, statusMessage: 'user not in your couple' })
  
  // 获取用户信息
  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) throw createError({ statusCode: 404, statusMessage: 'user not found' })
  
  const storage = createStorageService()
  const avatarUrl = targetUser.avatarUrl 
    ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(targetUser.avatarUrl) : targetUser.avatarUrl)
    : null
  
  return {
    user: {
      id: targetUser.id,
      nickName: targetUser.nickName,
      avatarUrl,
      status: targetUser.status,
      statusUpdatedAt: targetUser.statusUpdatedAt,
    }
  }
})

