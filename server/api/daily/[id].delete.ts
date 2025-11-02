import { defineEventHandler, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

/**
 * 删除日常记录（仅限作者本人）
 */
export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  
  const id = event.context.params?.id as string
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })
  
  // 查找记录
  const post = await prisma.dailyPost.findUnique({ where: { id } })
  if (!post) throw createError({ statusCode: 404, statusMessage: 'post not found' })
  
  // 检查是否是作者本人
  if (post.authorId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: 'only author can delete' })
  }
  
  // 检查是否在同一情侣关系中（额外安全检查）
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== post.coupleId) {
    throw createError({ statusCode: 403, statusMessage: 'forbidden' })
  }
  
  // 删除记录
  await prisma.dailyPost.delete({ where: { id } })
  
  return { ok: true }
})

