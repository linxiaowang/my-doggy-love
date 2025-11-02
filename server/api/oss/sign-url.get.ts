import { defineEventHandler, createError, getQuery } from 'h3'
import { readAuthFromCookie } from '../../utils/auth'
import { createStorageService } from '../../services/storage'

/**
 * 获取 OSS 文件的签名 URL
 * 用于访问私有 Bucket 中的文件
 * 
 * Query 参数:
 * - path: OSS 对象路径（必需）
 * - expires: 签名 URL 有效期（秒，可选，默认 3600）
 */
export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const query = getQuery(event)
  const objectPath = query.path as string
  const expires = query.expires ? parseInt(query.expires as string, 10) : 3600

  if (!objectPath) {
    throw createError({ statusCode: 400, statusMessage: 'path parameter is required' })
  }

  const storage = createStorageService()
  
  // 只有 OSS 存储服务才支持签名 URL
  if (storage.getSignedUrl) {
    const signedUrl = storage.getSignedUrl(objectPath, expires)
    return { url: signedUrl }
  }

  // 本地存储直接返回原 URL
  throw createError({ statusCode: 400, statusMessage: 'signature URL is only available for OSS storage' })
})

