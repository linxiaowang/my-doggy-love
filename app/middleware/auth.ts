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

  try {
    // 使用 navigateTo 的 abort 选项，避免在开发模式下频繁重定向
    const { user } = await $fetch('/api/auth/me', {
      credentials: 'include',
      timeout: 5000, // 5秒超时
    })
    
    if (!user) {
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
  } catch (error: any) {
    // 开发模式下，如果出错（可能是服务器重启），不强制跳转
    // 让页面正常加载，由页面组件在 onMounted 时处理
    if (process.dev) {
      console.warn('[Auth Middleware] 开发模式下跳过认证检查:', error?.message || error)
      return
    }
    
    // 生产环境才强制跳转
    // 但如果是网络错误等，也不跳转（可能是临时性问题）
    const statusCode = error?.statusCode || error?.status
    if (statusCode === 401 || statusCode === 403) {
      return navigateTo({
        path: '/user/login',
        query: { redirect: to.fullPath },
      })
    }
    
    // 其他错误（如 500、网络错误等）不跳转，让页面加载后由组件处理
    console.warn('[Auth Middleware] 认证检查出错，但继续加载页面:', error)
  }
})

