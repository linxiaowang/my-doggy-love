import { defineEventHandler, createError } from 'h3'
import { readAuthFromCookie } from '../../../utils/auth'
import prisma from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  // 获取所有系统提示词模板
  const templates = await prisma.systemPromptTemplate.findMany({
    orderBy: [
      { category: 'asc' },
      { displayName: 'asc' },
    ],
  })

  return {
    items: templates,
  }
})
