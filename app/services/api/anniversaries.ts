/**
 * 纪念日相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface Anniversary {
  id: string
  title: string
  date: string
}

export interface AnniversaryListResponse {
  items: Anniversary[]
}

export interface CreateAnniversaryRequest {
  title: string
  date: string
}

export interface UpdateAnniversaryRequest {
  title: string
  date: string
}

/**
 * 获取纪念日列表
 */
export function useAnniversaries() {
  return useApiFetch<AnniversaryListResponse>('/api/anniversaries')
}

/**
 * 创建纪念日
 */
export async function createAnniversary(data: CreateAnniversaryRequest): Promise<{ id: string }> {
  return apiFetch('/api/anniversaries', {
    method: 'POST',
    body: data,
  })
}

/**
 * 更新纪念日
 */
export async function updateAnniversary(id: string, data: UpdateAnniversaryRequest): Promise<{ id: string }> {
  return apiFetch(`/api/anniversaries/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

/**
 * 删除纪念日
 */
export async function deleteAnniversary(id: string): Promise<void> {
  return apiFetch(`/api/anniversaries/${id}`, {
    method: 'DELETE',
  })
}

