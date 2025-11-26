import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { user: null }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return { user: null }
  
  // 如果 token 包含 sessionId，验证 session 是否存在且有效
  if (payload.sessionId) {
    const session = await prisma.session.findUnique({ where: { id: payload.sessionId } })
    if (!session || session.userId !== user.id) {
      // Session 不存在或不属于当前用户，返回未登录状态
      return { user: null }
    }
    // 更新 session 的最后活跃时间（不检查过期时间，因为现在是永久有效的）
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    })
  }
  
  // Token 现在是永久有效的，不需要自动刷新
  // 移除自动刷新逻辑，保持登录状态永久有效
  
  const storage = createStorageService()
  // 将存储的 URL 转换为可访问的签名 URL
  const avatarUrl = user.avatarUrl 
    ? (storage.toAccessibleUrl ? storage.toAccessibleUrl(user.avatarUrl) : user.avatarUrl)
    : null
  
  return {
    user: {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      avatarUrl,
      status: user.status,
      statusUpdatedAt: user.statusUpdatedAt,
      wechatOpenId: user.wechatOpenId,
      wechatNickName: user.wechatNickName,
      wechatAvatar: user.wechatAvatar,
    },
  }
})


