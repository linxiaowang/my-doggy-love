/**
 * 留言板相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface Message {
  id: string
  content: string
  createdAt: string
  commentCount?: number
  author?: {
    id: string
    nickName: string
    avatarUrl?: string
  }
}

export interface MessageListResponse {
  items: Message[]
  nextCursor: string | null
}

export interface CreateMessageRequest {
  content: string
}

/**
 * 获取留言列表（游标分页）
 */
export function getMessages(options?: { take?: number, cursor?: string }) {
  const query: Record<string, string> = {}
  if (options?.take) query.take = String(options.take)
  if (options?.cursor) query.cursor = options.cursor
  const qs = new URLSearchParams(query).toString()
  return apiFetch<MessageListResponse>(`/api/messages${qs ? `?${qs}` : ''}`)
}

/**
 * 获取留言列表（响应式）
 */
export function useMessages(options?: { take?: number, cursor?: string }) {
  const query: Record<string, string> = {}
  if (options?.take) query.take = String(options.take)
  if (options?.cursor) query.cursor = options.cursor
  const qs = new URLSearchParams(query).toString()
  return useApiFetch<MessageListResponse>(`/api/messages${qs ? `?${qs}` : ''}`)
}

/**
 * 创建留言
 */
export async function createMessage(data: CreateMessageRequest): Promise<{ id: string }> {
  return apiFetch('/api/messages', {
    method: 'POST',
    body: data,
  })
}

/**
 * 获取留言的评论
 */
export function useMessageComments(messageId: string) {
  return useApiFetch<{ items: any[] }>(`/api/messages/${messageId}/comments`)
}

/**
 * 发布评论
 */
export async function createMessageComment(messageId: string, content: string): Promise<{ id: string }> {
  return apiFetch(`/api/messages/${messageId}/comment`, {
    method: 'POST',
    body: { content },
  })
}

/**
 * 回复评论
 */
export async function replyToComment(commentId: string, content: string): Promise<{ id: string }> {
  return apiFetch(`/api/messages/comments/${commentId}/reply`, {
    method: 'POST',
    body: { content },
  })
}

