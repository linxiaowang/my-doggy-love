import { defineEventHandler, readBody, createError, setHeader } from 'h3'
import { readAuthFromCookie } from '../../utils/auth'
import prisma from '../../utils/db'
import { streamZhipuChat, type ZhipuMessage } from '../../utils/zhipu'
import { broadcastToRoom } from '../chat-ws'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const body = await readBody(event)
  const { conversationId, message, regenerateMessageId, conversationType } = body as {
    conversationId?: string
    message?: string
    regenerateMessageId?: string
    conversationType?: 'personal' | 'couple'
  }

  if (!message && !regenerateMessageId) {
    throw createError({ statusCode: 400, statusMessage: 'message or regenerateMessageId required' })
  }

  // 设置 SSE 响应头
  setHeader(event, 'content-type', 'text/event-stream')
  setHeader(event, 'cache-control', 'no-cache, no-transform')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'x-accel-buffering', 'no')

  let conversationIdToUse = conversationId
  let userMessageContent = message

  // 检测是否需要调用 AI（个人会话自动调用，情侣会话需要 @AI 提及）
  const trimmedMessage = message?.trimStart() || ''
  const shouldInvokeAI = conversationType === 'personal' ||
                         trimmedMessage.startsWith('@AI ') ||
                         trimmedMessage.startsWith('@ai ') ||
                         trimmedMessage.startsWith('@AI') ||
                         trimmedMessage.startsWith('@ai')

  // 如果是情侣会话且检测到 @AI，去除前缀
  if (conversationType === 'couple' && shouldInvokeAI && message) {
    // 使用更精确的正则：匹配 @AI 或 @ai，后面可选的空格
    // ^@AI\s? 会匹配 "@AI " 或 "@AI"
    userMessageContent = message.replace(/^@AI\s?|^@ai\s?/, '').trimStart()

    console.log('[Chat Stream] @AI detected in couple conversation, stripped prefix:', {
      original: message,
      cleaned: userMessageContent,
    })
  }

  // 如果是重新生成，获取会话和历史消息
  if (regenerateMessageId) {
    const regenerateMsg = await prisma.chatMessage.findUnique({
      where: { id: regenerateMessageId },
    })

    if (!regenerateMsg) {
      return createEventStream(event, { error: 'Message not found' }, true)
    }

    conversationIdToUse = regenerateMsg.conversationId

    // 删除要重新生成的消息之后的所有消息
    await prisma.chatMessage.deleteMany({
      where: {
        conversationId,
        createdAt: {
          gte: regenerateMsg.createdAt,
        },
      },
    })
  }

  // 获取或创建会话
  let conversation = conversationIdToUse
    ? await prisma.chatConversation.findUnique({
        where: { id: conversationIdToUse },
        include: {
          systemPromptTemplate: true,
        },
      })
    : null

  // 如果没有会话 ID 或会话不存在，创建新会话
  if (!conversation) {
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
      return createEventStream(event, { error: 'User not found' }, true)
    }

    // 检查是否有情侣关系
    const coupleId = user.coupleMemberships[0]?.coupleId

    // 确定会话类型：情侣会话需要 coupleId
    let type: 'personal' | 'couple' = 'personal'
    if (conversationType === 'couple') {
      if (!coupleId) {
        console.error('[Chat Stream] Couple conversation requested but no coupleId found for user:', payload.userId)
        return createEventStream(event, { error: '请先建立情侣关系后再创建情侣会话' }, true)
      }
      type = 'couple'
    }

    console.log('[Chat Stream] Creating conversation:', {
      userId: payload.userId,
      coupleId,
      requestedType: conversationType,
      actualType: type,
    })

    conversation = await prisma.chatConversation.create({
      data: {
        userId: payload.userId,
        coupleId: type === 'couple' ? coupleId : null,
        title: generateTitleFromMessage(userMessageContent || '新对话'),
        type,
      },
      include: {
        systemPromptTemplate: true,
      },
    })

    console.log('[Chat Stream] Conversation created:', {
      id: conversation.id,
      type: conversation.type,
      coupleId: conversation.coupleId,
    })
  }

  // 检查权限
  const canAccess =
    conversation.userId === payload.userId ||
    (conversation.type === 'couple' && conversation.coupleId === payload.coupleId)

  if (!canAccess) {
    // 对于情侣会话，检查是否是情侣成员
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
        return createEventStream(event, { error: 'Forbidden' }, true)
      }
    } else {
      return createEventStream(event, { error: 'Forbidden' }, true)
    }
  }

  // 保存用户消息
  let newUserMessage = null
  if (userMessageContent) {
    newUserMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        userId: payload.userId,
        role: 'user',
        content: userMessageContent,
      },
    })

    // 获取用户信息用于广播
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        nickName: true,
        avatarUrl: true,
      },
    })

    // 更新会话的最后更新时间
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    // 广播消息到 WebSocket 房间（实时同步给伴侣）
    broadcastToRoom(`conversation:${conversation.id}`, 'chat:message:new', {
      id: newUserMessage.id,
      conversationId: conversation.id,
      role: 'user',
      content: userMessageContent,
      userId: payload.userId,
      user: user,
      createdAt: newUserMessage.createdAt,
    })
  }

  // 获取历史消息（限制数量以避免 token 超限）
  const historyLimit = 20
  const historyMessages = await prisma.chatMessage.findMany({
    where: {
      conversationId: conversation.id,
      role: {
        not: 'system',
      },
    },
    orderBy: { createdAt: 'desc' },
    take: historyLimit,
  })
  const reversedHistory = historyMessages.reverse()

  // 构建 API 消息列表
  const apiMessages: ZhipuMessage[] = []

  // 添加系统提示词
  const systemPrompt = conversation.customSystemPrompt || conversation.systemPromptTemplate?.prompt
  if (systemPrompt) {
    apiMessages.push({
      role: 'system',
      content: systemPrompt,
    })
  }

  // 添加历史消息
  for (const msg of reversedHistory) {
    apiMessages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })
  }

  // 发送会话 ID
  sendEvent(event, 'conversation_id', conversation.id)

  // 只有在需要时才调用 AI
  if (!shouldInvokeAI) {
    console.log('[Chat Stream] AI invocation skipped (couple conversation without @AI)')
    // 发送完成事件（但没有 AI 消息）
    sendEvent(event, 'done', JSON.stringify({
      messageId: '',
      content: '',
    }))
    sendEvent(event, 'end', '')
    return
  }

  // 流式调用智谱 AI
  let fullContent = ''
  try {
    for await (const chunk of streamZhipuChat({
      model: 'glm-4-flash',
      messages: apiMessages,
      temperature: 0.7,
    })) {
      fullContent += chunk
      sendEvent(event, 'chunk', chunk)
    }

    // 保存助手回复
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: fullContent,
      },
    })

    // 广播 AI 消息到 WebSocket 房间
    broadcastToRoom(`conversation:${conversation.id}`, 'chat:message:new', {
      id: assistantMessage.id,
      conversationId: conversation.id,
      role: 'assistant',
      content: fullContent,
      userId: null,
      user: null,
      createdAt: assistantMessage.createdAt,
    })

    // 自动更新会话标题（如果是"新对话"且这是第一次有消息）
    if (conversation.title === '新对话' && userMessageContent) {
      const newTitle = generateTitleFromMessage(userMessageContent)
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { title: newTitle },
      })
      console.log('[Chat Stream] Auto-updated conversation title:', {
        conversationId: conversation.id,
        oldTitle: conversation.title,
        newTitle,
      })
    }

    // 发送完成事件
    sendEvent(event, 'done', JSON.stringify({
      messageId: assistantMessage.id,
      content: fullContent,
    }))

  } catch (error: any) {
    console.error('[Chat Stream] Error:', error)
    sendEvent(event, 'error', error.message || 'Stream error')
  }

  sendEvent(event, 'end', '')
})

// 辅助函数：从消息生成标题
function generateTitleFromMessage(message: string): string {
  // 取前 20 个字符作为标题
  const cleaned = message.trim().replace(/\n/g, ' ')
  return cleaned.length > 20 ? cleaned.slice(0, 20) + '...' : cleaned
}

// 辅助函数：发送 SSE 事件
function sendEvent(event: any, type: string, data: string) {
  event.node.res.write(`event: ${type}\ndata: ${data}\n\n`)
}

// 辅助函数：创建事件流（用于错误）
function createEventStream(event: any, data: any, isEnd: boolean = false) {
  sendEvent(event, 'error', JSON.stringify(data))
  if (isEnd) {
    sendEvent(event, 'end', '')
  }
  return event.node.res
}
