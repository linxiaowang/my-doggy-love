import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/db'
import { readAuthFromCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const body = await readBody<{ status?: 'todo' | 'done'; title?: string; description?: string }>(event)

  let finishedAt: Date | null | undefined
  if (body.status === 'done') finishedAt = new Date()
  if (body.status === 'todo') finishedAt = null

  const w = await prisma.wish.update({
    where: { id },
    data: { status: body.status, title: body.title, description: body.description, finishedAt: finishedAt as any }
  })
  return { id: w.id, status: w.status, finishedAt: w.finishedAt }
})


