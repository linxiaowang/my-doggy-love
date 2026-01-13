/**
 * AI Chat 相关 API
 */

import { apiFetch } from './index'

// 类型定义
export interface ChatConversation {
  id: string
  title: string
  type: 'personal' | 'couple'
  systemPromptId?: string | null
  customSystemPrompt?: string | null
  systemPromptTemplate?: {
    id: string
    name: string
    displayName: string
  }
  createdAt: string
  updatedAt: string
  lastMessage?: {
    id: string
    role: string
    content: string
    createdAt: string
  } | null
}

export interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  user?: {
    id: string
    nickName: string
    avatarUrl?: string | null
  } | null
}

export interface SystemPromptTemplate {
  id: string
  name: string
  displayName: string
  description?: string | null
  prompt: string
  category?: string | null
  isDefault: boolean
  createdAt: string
}

export interface ConversationsResponse {
  items: ChatConversation[]
  hasCouple: boolean
}

export interface MessagesResponse {
  items: ChatMessage[]
  nextCursor: string | null
}

/**
 * 获取会话列表
 */
export async function getConversations(type?: 'personal' | 'couple'): Promise<ConversationsResponse> {
  const query = type ? `?type=${type}` : ''
  return apiFetch<ConversationsResponse>(`/api/chat/conversations${query}`)
}

/**
 * 创建新会话
 */
export async function createConversation(data: {
  title?: string
  type?: 'personal' | 'couple'
  systemPromptId?: string
  customSystemPrompt?: string
}): Promise<ChatConversation> {
  return apiFetch<ChatConversation>('/api/chat/conversations', {
    method: 'POST',
    body: data,
  })
}

/**
 * 删除会话
 */
export async function deleteConversation(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/chat/conversations/${id}/delete`, {
    method: 'DELETE',
  })
}

/**
 * 更新会话
 */
export async function updateConversation(
  id: string,
  data: {
    title?: string
    systemPromptId?: string | null
    customSystemPrompt?: string | null
  }
): Promise<ChatConversation> {
  return apiFetch<ChatConversation>(`/api/chat/conversations/${id}/patch`, {
    method: 'PATCH',
    body: data,
  })
}

/**
 * 获取会话消息历史
 */
export async function getMessages(
  conversationId: string,
  limit?: number,
  cursor?: string
): Promise<MessagesResponse> {
  const params = new URLSearchParams()
  if (limit) params.append('limit', String(limit))
  if (cursor) params.append('cursor', cursor)
  const query = params.toString() ? `?${params}` : ''
  return apiFetch<MessagesResponse>(`/api/chat/messages/${conversationId}${query}`)
}

/**
 * 获取系统提示词模板列表
 */
export async function getSystemPromptTemplates(): Promise<{ items: SystemPromptTemplate[] }> {
  return apiFetch<{ items: SystemPromptTemplate[] }>('/api/chat/templates')
}

/**
 * 流式聊天回调类型
 */
export interface StreamChatCallbacks {
  onConversationId: (conversationId: string) => void
  onChunk: (chunk: string) => void
  onDone: (data: { messageId: string; content: string }) => void
  onError: (error: string) => void
  onEnd: () => void
}

/**
 * 流式聊天
 */
export async function streamChat(
  message: string,
  conversationId: string | undefined,
  regenerateMessageId: string | undefined,
  callbacks: StreamChatCallbacks,
  conversationType?: 'personal' | 'couple'
): Promise<() => void> {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId,
      message,
      regenerateMessageId,
      conversationType,
    }),
  })

  if (!response.ok) {
    callbacks.onError(`HTTP ${response.status}: ${response.statusText}`)
    callbacks.onEnd()
    return () => {}
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let isAborted = false
  let currentEvent = ''

  const processText = (text: string) => {
    buffer += text
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      // 解析 SSE event 行
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
        continue
      }

      // 解析 SSE data 行
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()

        switch (currentEvent || 'chunk') {
          case 'conversation_id':
            callbacks.onConversationId(data)
            break
          case 'chunk':
            callbacks.onChunk(data)
            break
          case 'done':
            try {
              const parsed = JSON.parse(data)
              callbacks.onDone(parsed)
            } catch {
              callbacks.onDone({ messageId: '', content: data })
            }
            break
          case 'error':
            try {
              const parsed = JSON.parse(data)
              callbacks.onError(typeof parsed === 'string' ? parsed : JSON.stringify(parsed))
            } catch {
              callbacks.onError(data)
            }
            break
          case 'end':
            isAborted = true
            callbacks.onEnd()
            break
          default:
            // 没有 event 类型，默认当作 chunk
            if (data) {
              callbacks.onChunk(data)
            }
        }
        // 重置 event 类型
        currentEvent = ''
      }
    }
  }

  const readLoop = async () => {
    try {
      while (!isAborted) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        processText(text)
      }
    } catch (error) {
      if (!isAborted) {
        callbacks.onError(error instanceof Error ? error.message : 'Stream error')
      }
    } finally {
      callbacks.onEnd()
      reader.releaseLock()
    }
  }

  readLoop()

  // 返回取消函数
  return () => {
    isAborted = true
    reader.cancel().catch(() => {})
  }
}
