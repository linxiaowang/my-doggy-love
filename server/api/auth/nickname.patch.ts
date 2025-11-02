import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })

  const body = await readBody<{ nickName: string }>(event)
  const nickName = body?.nickName?.trim()

  if (!nickName) {
    throw createError({ statusCode: 400, statusMessage: '昵称不能为空' })
  }

  if (nickName.length > 20) {
    throw createError({ statusCode: 400, statusMessage: '昵称长度不能超过20个字符' })
  }

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { nickName },
  })

  return {
    id: user.id,
    nickName: user.nickName,
  }
})

