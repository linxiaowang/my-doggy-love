/**
 * 认证初始化插件
 * 在应用启动时初始化用户认证状态
 */
export default defineNuxtPlugin(async () => {
  // 只在客户端执行
  if (!process.client) {
    return
  }

  const authStore = useAuthStore()

  // 如果还未初始化，则获取用户信息
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }
})
