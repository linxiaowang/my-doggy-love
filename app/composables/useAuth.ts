/**
 * 认证相关的组合式函数
 * 用于检查登录状态和处理未登录情况
 */

export const useAuth = () => {
  // 直接使用 Pinia store，避免重复的状态管理
  const authStore = useAuthStore()

  return {
    user: authStore.user as typeof authStore.user,
    loading: authStore.loading,
    isAuthenticated: authStore.isAuthenticated,
    checkAuth: authStore.fetchUser,
    requireAuth: async (redirectTo?: string) => {
      const currentUser = await authStore.fetchUser()
      if (!currentUser) {
        const redirectPath = redirectTo || useRoute().fullPath
        await navigateTo({
          path: '/user/login',
          query: { redirect: redirectPath },
        })
        return null
      }
      return currentUser
    },
    logout: async () => {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
        authStore.clearUser()
        await navigateTo('/user/login')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },
  }
}

