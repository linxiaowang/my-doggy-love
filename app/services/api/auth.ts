/**
 * 认证相关 API
 */

import { useApiFetch, apiFetch } from './index'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickName?: string
}

export interface User {
  id: string
  email?: string
  nickName: string
  avatarUrl?: string
  status?: string | null
  statusUpdatedAt?: string | null
  wechatOpenId?: string | null
  wechatNickName?: string | null
  wechatAvatar?: string | null
}

export interface AuthResponse {
  user: User
}

export interface MeResponse {
  user: User | null
}

/**
 * 获取当前用户信息
 */
export function useAuthMe() {
  return useApiFetch<MeResponse>('/api/auth/me', {
    // 仅在客户端发起，避免 SSR 阶段拿不到 cookie 导致 user=null
    server: false,
    immediate: true,
  })
}

/**
 * 登录
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: data,
  })
}

/**
 * 注册
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: data,
  })
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
  })
}

/**
 * 更新用户状态
 */
export async function updateStatus(status: string | null): Promise<{ status: string | null; statusUpdatedAt: string | null }> {
  return apiFetch('/api/auth/status', {
    method: 'PATCH',
    body: { status },
  })
}

/**
 * 更新用户昵称
 */
export async function updateNickname(nickName: string): Promise<{ id: string; nickName: string }> {
  return apiFetch('/api/auth/nickname', {
    method: 'PATCH',
    body: { nickName },
  })
}

/**
 * 上传头像
 */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<{ avatarUrl: string }>('/api/auth/avatar', {
    method: 'POST',
    body: formData,
  })
}

