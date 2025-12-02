import { acceptHMRUpdate, defineStore } from 'pinia'
import type { User } from '@/services/api/auth'
import { apiFetch } from '@/services/api'

export interface MeResponse {
  user: User | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const initialized = ref<boolean>(false)

  const isAuthenticated = computed(() => !!user.value)

  /**
   * 获取当前用户信息
   */
  async function fetchUser() {
    // 只在客户端执行，避免 SSR 阶段拿不到 cookie 导致 user=null
    if (!process.client) {
      return null
    }

    // 如果正在加载，避免重复请求
    if (loading.value) {
      return user.value
    }

    loading.value = true
    try {
      const res = await apiFetch<MeResponse>('/api/auth/me')
      user.value = res.user
      initialized.value = true
      return res.user
    } catch (error) {
      user.value = null
      initialized.value = true
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置用户信息
   */
  function setUser(newUser: User | null) {
    user.value = newUser
    initialized.value = true
  }

  /**
   * 清空用户信息
   */
  function clearUser() {
    user.value = null
    initialized.value = true
  }

  /**
   * 刷新用户信息
   */
  async function refreshUser() {
    return fetchUser()
  }

  /**
   * 更新用户信息（部分更新）
   */
  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isAuthenticated,
    fetchUser,
    setUser,
    clearUser,
    refreshUser,
    updateUser,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
