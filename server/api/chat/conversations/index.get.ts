import { defineEventHandler, getQuery, createError } from 'h3'
import { readAuthFromCookie } from '../../../utils/auth'
import prisma from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const query = getQuery(event)
  const type = query.type as string | undefined // personal | couple

  // 获取用户的情侣关系
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      coupleMemberships: {
        include: {
          couple: true,
        },
      },
    },
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'user not found' })
  }

  const coupleId = user.coupleMemberships[0]?.coupleId

  // 构建查询条件
  const whereClause: any = {
    OR: [] as any[],
  }

  // 情侣会话：查询所有属于这个情侣关系的会话（不管是谁创建的）
  if (coupleId && (type === 'couple' || !type)) {
    whereClause.OR.push({
      type: 'couple',
      coupleId: coupleId,
    })
  }

  // 个人会话：只查当前用户创建的
  if (type === 'personal' || !type) {
    whereClause.OR.push({
      type: 'personal',
      userId: payload.userId,
    })
  }

  // 如果 OR 数组为空（不应该发生），返回空结果
  if (whereClause.OR.length === 0) {
    whereClause.OR.push({
      id: 'nonexistent-id', // 永远匹配不到
    })
  }

  console.log('[Chat Conversations] Query clause:', JSON.stringify(whereClause, null, 2))

  // 获取会话列表
  const conversations = await prisma.chatConversation.findMany({
    where: whereClause,
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      systemPromptTemplate: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // 如果没有情侣关系，过滤掉情侣会话
  let filteredConversations = conversations
  if (!coupleId) {
    filteredConversations = conversations.filter((conv) => conv.type === 'personal')
  }

  console.log('[Chat Conversations] Fetch result:', {
    userId: payload.userId,
    coupleId,
    type,
    totalFound: conversations.length,
    afterFilter: filteredConversations.length,
    beforeFilter: conversations.map(c => ({ id: c.id, type: c.type, coupleId: c.coupleId })),
    afterFilterList: filteredConversations.map(c => ({ id: c.id, type: c.type, coupleId: c.coupleId })),
  })

  return {
    items: filteredConversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      type: conv.type,
      systemPromptId: conv.systemPromptId,
      systemPromptTemplate: conv.systemPromptTemplate,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages[0] || null,
    })),
    hasCouple: !!coupleId,
  }
})
