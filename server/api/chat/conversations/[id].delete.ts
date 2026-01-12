import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readAuthFromCookie } from '../../../utils/auth'
import prisma from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'conversation id required' })
  }

  // 检查会话是否存在且属于当前用户
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
  })

  if (!conversation) {
    throw createError({ statusCode: 404, statusMessage: 'conversation not found' })
  }

  // 检查权限：只能由创建者删除
  // （个人会话和情侣会话都只能由创建者删除，避免误删对方数据）
  if (conversation.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  }

  // 删除会话（消息会通过 cascade 自动删除）
  await prisma.chatConversation.delete({
    where: { id },
  })

  return { success: true }
})
