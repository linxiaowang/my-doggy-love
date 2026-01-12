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

  // 检查权限：个人会话只能由创建者删除，情侣会话可以由情侣双方删除
  if (conversation.type === 'personal') {
    if (conversation.userId !== payload.userId) {
      throw createError({ statusCode: 403, statusMessage: 'forbidden' })
    }
  } else {
    // 情侣会话：检查是否是情侣成员
    if (conversation.userId !== payload.userId && conversation.coupleId !== payload.coupleId) {
      // 需要检查当前用户是否是该情侣的成员
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          coupleMemberships: {
            where: { coupleId: conversation.coupleId! },
          },
        },
      })

      if (!user || !user.coupleMemberships.length) {
        throw createError({ statusCode: 403, statusMessage: 'forbidden' })
      }
    }
  }

  // 删除会话（消息会通过 cascade 自动删除）
  await prisma.chatConversation.delete({
    where: { id },
  })

  return { success: true }
})
