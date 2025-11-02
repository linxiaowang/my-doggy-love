/**
 * 情侣相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface CoupleMember {
  id: string
  nickName: string
  avatarUrl?: string
  role: string
  status?: string | null
  statusUpdatedAt?: string | Date | null
}

export interface Couple {
  id: string
  code: string
  members: CoupleMember[]
}

export interface CoupleResponse {
  couple: Couple | null
}

/**
 * 获取当前用户的情侣信息
 */
export function useCouple() {
  return useApiFetch<CoupleResponse>('/api/couple/me')
}

/**
 * 创建情侣
 */
export async function createCouple(): Promise<{ couple: Couple }> {
  return apiFetch('/api/couple/create', {
    method: 'POST',
  })
}

/**
 * 加入情侣
 */
export async function joinCouple(code: string): Promise<{ couple: Couple }> {
  return apiFetch('/api/couple/join', {
    method: 'POST',
    body: { code },
  })
}

/**
 * 切换情侣绑定
 */
export async function switchCouple(code: string): Promise<{ couple: Couple }> {
  return apiFetch('/api/couple/switch', {
    method: 'POST',
    body: { code },
  })
}

