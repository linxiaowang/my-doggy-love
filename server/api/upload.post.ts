import { defineEventHandler, createError } from 'h3'
import { createStorageService, parseMultipartToFileLikes } from '../services/storage'
import { readAuthFromCookie } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const files = await parseMultipartToFileLikes(event)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'file required' })
  const storage = createStorageService()
  const results: Array<string | { url: string; thumbnailUrl?: string }> = []
  for (const f of files) {
    // 为图片文件生成缩略图
    const saved = await storage.save(f, { 
      prefix: 'media',
      generateThumbnail: f.type?.startsWith('image/') || false
    })
    // 返回存储的 URL（可能包含 oss: 前缀），前端在显示时才转换为签名 URL
    // 为了兼容旧版本，如果有缩略图则返回对象，否则返回字符串
    if (saved.thumbnailUrl) {
      results.push({
        url: saved.url,
        thumbnailUrl: saved.thumbnailUrl,
      })
    } else {
      results.push(saved.url)
    }
  }
  return { urls: results }
})


