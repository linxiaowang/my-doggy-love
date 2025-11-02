/**
 * 愿望清单相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface Wish {
  id: string
  title: string
  status: 'todo' | 'done'
  finishedAt?: string
}

export interface WishListResponse {
  items: Wish[]
}

export interface CreateWishRequest {
  title: string
}

export interface UpdateWishRequest {
  status: 'todo' | 'done'
}

/**
 * 获取愿望列表
 */
export function useWishes() {
  return useApiFetch<WishListResponse>('/api/wishes')
}

/**
 * 创建愿望
 */
export async function createWish(data: CreateWishRequest): Promise<{ id: string }> {
  return apiFetch('/api/wishes', {
    method: 'POST',
    body: data,
  })
}

/**
 * 更新愿望状态
 */
export async function updateWish(id: string, data: UpdateWishRequest): Promise<{ id: string }> {
  return apiFetch(`/api/wishes/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

