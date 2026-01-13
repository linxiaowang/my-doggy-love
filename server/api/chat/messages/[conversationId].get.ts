import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3'
import { readAuthFromCookie } from '../../../utils/auth'
import prisma from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const conversationId = getRouterParam(event, 'conversationId')
  if (!conversationId) {
    throw createError({ statusCode: 400, statusMessage: 'conversation id required' })
  }

  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 50
  const cursor = query.cursor as string | undefined

  // 检查会话是否存在
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    throw createError({ statusCode: 404, statusMessage: 'conversation not found' })
  }

  // 检查权限
  const canAccess =
    conversation.userId === payload.userId ||
    (conversation.type === 'couple' && conversation.coupleId === payload.coupleId)

  if (!canAccess) {
    // 对于情侣会话，需要检查是否是情侣成员
    if (conversation.type === 'couple') {
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
    } else {
      throw createError({ statusCode: 403, statusMessage: 'forbidden' })
    }
  }

  // 构建查询条件
  const whereClause = {
    conversationId,
    role: {
      not: 'system', // 不返回系统消息
    },
  }

  // 游标分页
  const cursorOption = cursor
    ? {
        cursor: { id: cursor },
        skip: 1,
      }
    : undefined

  // 获取消息，包含用户信息
  const messages = await prisma.chatMessage.findMany({
    where: whereClause,
    take: limit,
    ...cursorOption,
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          nickName: true,
          avatarUrl: true,
        },
      },
    },
  })

  return {
    items: messages,
    nextCursor: messages.length === limit ? (messages[messages.length - 1]?.id ?? null) : null,
  }
})
