import { defineEventHandler, getQuery, createError, getCookie, setCookie, sendRedirect } from 'h3'
import prisma from '../../../utils/db'
import { signToken, setAuthCookie } from '../../../utils/auth'

/**
 * 微信登录回调处理
 * 微信登录流程第二步：处理微信回调，获取用户信息并登录
 */
export default defineEventHandler(async (event) => {
  const env = (globalThis as any).process?.env
  const appId = env?.WECHAT_APPID
  const appSecret = env?.WECHAT_SECRET

  if (!appId || !appSecret) {
    throw createError({ statusCode: 500, statusMessage: '微信配置不完整' })
  }

  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string

  // 验证 state（防止 CSRF 攻击）
  const storedState = getCookie(event, 'wechat_oauth_state')
  if (!state || state !== storedState) {
    throw createError({ statusCode: 400, statusMessage: '无效的请求，请重新登录' })
  }

  // 清除 state cookie
  setCookie(event, 'wechat_oauth_state', '', { maxAge: 0 })

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: '授权失败，未获取到授权码' })
  }

  try {
    // 第一步：使用 code 换取 access_token
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
    
    const tokenResponse = await fetch(tokenUrl)
    const tokenData = await tokenResponse.json()

    if (tokenData.errcode || !tokenData.access_token) {
      console.error('微信获取 access_token 失败:', tokenData)
      throw createError({ statusCode: 401, statusMessage: '微信授权失败，请重试' })
    }

    const { access_token, openid, unionid } = tokenData

    // 第二步：使用 access_token 获取用户信息
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`
    
    const userInfoResponse = await fetch(userInfoUrl)
    const userInfo = await userInfoResponse.json()

    if (userInfo.errcode || !userInfo.openid) {
      console.error('微信获取用户信息失败:', userInfo)
      throw createError({ statusCode: 401, statusMessage: '获取微信用户信息失败' })
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({ where: { wechatOpenId: openid } })

    if (user) {
      // 用户已存在，更新微信信息
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          wechatNickName: userInfo.nickname || null,
          wechatAvatar: userInfo.headimgurl || null,
          wechatUnionId: unionid || null,
        },
      })
    } else {
      // 新用户，创建账号
      const nickName = userInfo.nickname || `微信用户_${openid.substring(0, 8)}`
      
      user = await prisma.user.create({
        data: {
          wechatOpenId: openid,
          wechatUnionId: unionid || null,
          wechatNickName: userInfo.nickname || null,
          wechatAvatar: userInfo.headimgurl || null,
          nickName,
          avatarUrl: userInfo.headimgurl || null,
        },
      })
    }

    // 生成 token 并设置 cookie
    const token = signToken({ userId: user.id, iat: Date.now() })
    setAuthCookie(event, token)

    // 重定向到保存的路径或首页
    const savedRedirect = getCookie(event, 'wechat_oauth_redirect')
    const redirectUrl = savedRedirect || query.redirect as string || '/'
    
    // 清除重定向 cookie
    if (savedRedirect) {
      setCookie(event, 'wechat_oauth_redirect', '', { maxAge: 0 })
    }
    
    return sendRedirect(event, redirectUrl)

  } catch (error: any) {
    console.error('微信登录回调处理失败:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: '微信登录失败，请重试' })
  }
})

