/**
 * 认证中间件 - 检查用户是否已登录
 * 未登录时重定向到登录页
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 跳过登录和注册页面
  if (to.path === '/user/login' || to.path === '/user/register') {
    return
  }

  // 只在客户端执行认证检查，避免 SSR 时的 cookie 问题
  // 以及开发模式下热更新时的临时性问题
  if (!process.client) {
    return
  }

  const authStore = useAuthStore()

  // 如果还未初始化，等待初始化完成
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }

  // 检查用户是否已登录
  if (!authStore.user) {
    // 开发模式下，如果未登录也允许继续加载，避免热更新时的频繁跳转
    // 让页面组件在 onMounted 时处理认证检查
    if (process.dev) {
      return
    }
    return navigateTo({
      path: '/user/login',
      query: { redirect: to.fullPath },
    })
  }
})

