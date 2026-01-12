import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
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

  const body = await readBody(event)
  const { title, systemPromptId, customSystemPrompt } = body as {
    title?: string
    systemPromptId?: string | null
    customSystemPrompt?: string | null
  }

  // 检查会话是否存在
  const conversation = await prisma.chatConversation.findUnique({
    where: { id },
  })

  if (!conversation) {
    throw createError({ statusCode: 404, statusMessage: 'conversation not found' })
  }

  // 检查权限
  const canEdit =
    conversation.userId === payload.userId ||
    (conversation.type === 'couple' && conversation.coupleId === payload.coupleId)

  if (!canEdit) {
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

  // 更新会话
  const updated = await prisma.chatConversation.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(systemPromptId !== undefined && { systemPromptId }),
      ...(customSystemPrompt !== undefined && { customSystemPrompt }),
    },
  })

  return {
    id: updated.id,
    title: updated.title,
    type: updated.type,
    systemPromptId: updated.systemPromptId,
    customSystemPrompt: updated.customSystemPrompt,
    updatedAt: updated.updatedAt,
  }
})
