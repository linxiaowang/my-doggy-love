import { defineEventHandler, createError } from 'h3'
import { createStorageService, parseMultipartToFileLikes } from '../services/storage'
import { readAuthFromCookie } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const files = await parseMultipartToFileLikes(event)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'file required' })
  const storage = createStorageService()
  const results = []
  for (const f of files) {
    const saved = await storage.save(f, { prefix: 'media' })
    // 返回存储的 URL（可能包含 oss: 前缀），前端在显示时才转换为签名 URL
    // 但为了兼容，这里也返回可访问的 URL
    results.push(saved.url)
  }
  return { urls: results }
})


