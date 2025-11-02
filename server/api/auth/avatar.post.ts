import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService, parseMultipartToFileLikes } from '../../services/storage'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const files = await parseMultipartToFileLikes(event)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'file required' })
  const storage = createStorageService()
  const saved = await storage.save(files[0], { prefix: 'avatars' })

  const user = await prisma.user.update({ where: { id: payload.userId }, data: { avatarUrl: saved.url } })
  
  // 将存储的 URL 转换为可访问的签名 URL
  const accessibleUrl = storage.toAccessibleUrl ? storage.toAccessibleUrl(user.avatarUrl!) : user.avatarUrl
  
  return { avatarUrl: accessibleUrl }
})


