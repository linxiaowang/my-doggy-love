/**
 * 日常记录相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface DailyPost {
  id: string
  content: string
  mediaUrls: any
  tags: string[]
  createdAt: string
}

export interface DailyPostListResponse {
  items: DailyPost[]
}

export interface CreateDailyPostRequest {
  content: string
  mediaUrls?: string[]
  tags?: string[]
}

export interface CreateDailyPostResponse {
  id: string
}

/**
 * 获取日常记录列表
 */
export function useDailyList(options?: { take?: number; cursor?: string }) {
  const query: Record<string, string> = {}
  if (options?.take) query.take = String(options.take)
  if (options?.cursor) query.cursor = options.cursor
  
  const queryString = new URLSearchParams(query).toString()
  const url = `/api/daily${queryString ? `?${queryString}` : ''}`
  
  return useApiFetch<DailyPostListResponse>(url)
}

/**
 * 获取单条日常记录
 */
export function useDailyPost(id: string) {
  return useApiFetch<{ item: DailyPost }>(`/api/daily/${id}`)
}

/**
 * 创建日常记录
 */
export async function createDailyPost(data: CreateDailyPostRequest): Promise<CreateDailyPostResponse> {
  return apiFetch<CreateDailyPostResponse>('/api/daily', {
    method: 'POST',
    body: data,
  })
}

/**
 * 获取日常记录的评论
 */
export function useDailyPostComments(postId: string | (() => string)) {
  const url = typeof postId === 'function' ? () => `/api/daily/${postId()}/comments` : `/api/daily/${postId}/comments`
  return useApiFetch<{ items: any[] }>(url)
}

/**
 * 发布评论
 */
export async function createDailyComment(postId: string, content: string): Promise<{ id: string }> {
  return apiFetch(`/api/daily/${postId}/comment`, {
    method: 'POST',
    body: { content },
  })
}

