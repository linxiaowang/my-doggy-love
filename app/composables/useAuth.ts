/**
 * 认证相关的组合式函数
 * 用于检查登录状态和处理未登录情况
 */

export const useAuth = () => {
  const user = ref<{ id: string; email?: string; nickName: string; avatarUrl?: string } | null>(null)
  const loading = ref(true)
  const isAuthenticated = computed(() => !!user.value)

  /**
   * 检查当前登录状态
   */
  async function checkAuth() {
    loading.value = true
    try {
      const res = await $fetch<{ user: any }>('/api/auth/me')
      user.value = res.user
      return res.user
    } catch (error) {
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 要求登录，未登录则跳转到登录页
   * @param redirectTo 登录后要跳转的路径，默认使用当前路径
   */
  async function requireAuth(redirectTo?: string) {
    const currentUser = await checkAuth()
    if (!currentUser) {
      const redirectPath = redirectTo || useRoute().fullPath
      await navigateTo({
        path: '/user/login',
        query: { redirect: redirectPath },
      })
      return null
    }
    return currentUser
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      await navigateTo('/user/login')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  // 初始化时检查登录状态
  if (process.client) {
    checkAuth()
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    checkAuth,
    requireAuth,
    logout,
  }
}

