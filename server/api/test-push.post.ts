import { defineEventHandler, readBody, createError } from 'h3'
import { sendPushNotification } from '../services/push'
import { readAuthFromCookie } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await sendPushNotification(payload.userId, {
    title: '测试推送',
    body: '这是一条来自后端的测试推送通知',
    url: '/daily'
  })

  return { success: true }
})
