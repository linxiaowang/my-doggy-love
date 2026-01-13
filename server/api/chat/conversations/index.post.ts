import { defineEventHandler, readBody, createError } from 'h3'
import { readAuthFromCookie } from '../../../utils/auth'
import prisma from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const body = await readBody(event)
  const { title, type, systemPromptId, customSystemPrompt } = body as {
    title?: string
    type?: 'personal' | 'couple'
    systemPromptId?: string
    customSystemPrompt?: string
  }

  let coupleId: string | null = null

  // 验证会话类型并获取 coupleId
  if (type === 'couple') {
    // 检查用户是否已绑定情侣
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

    if (!user || !user.coupleMemberships.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'not in couple',
        message: '您还没有绑定情侣，无法创建情侣会话',
      })
    }

    // 从用户的情侣关系中获取 coupleId
    const firstMembership = user.coupleMemberships[0]
    coupleId = firstMembership?.coupleId ?? null
    console.log('[Create Conversation] Couple mode:', { userId: payload.userId, coupleId })
  }

  // 创建会话
  const conversation = await prisma.chatConversation.create({
    data: {
      userId: payload.userId,
      coupleId,
      title: title || '新对话',
      type: type || 'personal',
      systemPromptId,
      customSystemPrompt,
    },
    include: {
      systemPromptTemplate: {
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      },
    },
  })

  return {
    id: conversation.id,
    title: conversation.title,
    type: conversation.type,
    systemPromptId: conversation.systemPromptId,
    systemPromptTemplate: conversation.systemPromptTemplate,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  }
})
