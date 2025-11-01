import { defineEventHandler, createError } from 'h3'
import { LocalStorageService, parseMultipartToFileLikes } from '../services/storage'
import { readAuthFromCookie } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const files = await parseMultipartToFileLikes(event)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'file required' })
  const storage = new LocalStorageService()
  const results = []
  for (const f of files) {
    const saved = await storage.save(f, { prefix: 'media' })
    results.push(saved.url)
  }
  return { urls: results }
})


