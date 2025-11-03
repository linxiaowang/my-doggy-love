/**
 * 通知相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface Notification {
  id: string
  userId: string
  type: string
  relatedId?: string | null
  content: string
  read: boolean
  createdAt: string
}

export interface NotificationListResponse {
  items: Notification[]
}

export interface UnreadCountResponse {
  count: number
}

/**
 * 获取通知列表
 */
export function useNotifications(options?: { take?: number; unreadOnly?: boolean }) {
  const take = options?.take || 20
  const unreadOnly = options?.unreadOnly || false
  const url = `/api/notifications?take=${take}&unreadOnly=${unreadOnly}`
  return useApiFetch<NotificationListResponse>(url)
}

/**
 * 获取未读通知数量
 */
export function useUnreadNotificationCount() {
  return useApiFetch<UnreadCountResponse>('/api/notifications/unread-count')
}

/**
 * 标记通知为已读
 */
export async function markNotificationAsRead(id: string): Promise<{ id: string }> {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  })
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  return apiFetch('/api/notifications/read-all', {
    method: 'PATCH',
  })
}

