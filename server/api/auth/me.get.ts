import { defineEventHandler } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) return { user: null }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return { user: null }
  
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


