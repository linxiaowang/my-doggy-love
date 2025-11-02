import { defineEventHandler, getQuery, createError, getRequestHeader, setCookie, sendRedirect } from 'h3'

/**
 * 生成微信登录授权链接并重定向
 * 微信登录流程第一步：生成授权链接
 */
export default defineEventHandler(async (event) => {
  const env = (globalThis as any).process?.env
  const appId = env?.WECHAT_APPID
  const redirectUri = env?.WECHAT_REDIRECT_URI

  if (!appId) {
    throw createError({ statusCode: 500, statusMessage: '微信 AppID 未配置' })
  }

  // 获取回调 URI（优先使用环境变量，否则根据请求生成）
  let finalRedirectUri = redirectUri
  if (!finalRedirectUri) {
    const host = getRequestHeader(event, 'host') || 'localhost:3000'
    const protocol = getRequestHeader(event, 'x-forwarded-proto') || 'http'
    finalRedirectUri = `${protocol}://${host}/api/auth/wechat/callback`
  }

  // URL 编码回调地址
  const encodedRedirectUri = encodeURIComponent(finalRedirectUri)

  // 生成随机 state 参数（用于防止 CSRF 攻击）
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  // 将 state 存储在 cookie 中，回调时验证
  setCookie(event, 'wechat_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // 10 分钟过期
  })

  // 保存重定向路径
  const query = getQuery(event)
  const redirect = query.redirect as string
  if (redirect) {
    setCookie(event, 'wechat_oauth_redirect', redirect, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600, // 10 分钟过期
    })
  }

  // 构建微信授权链接
  // 使用 snsapi_userinfo 获取用户信息
  const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`

  // 重定向到微信授权页面
  return sendRedirect(event, wechatAuthUrl)
})

