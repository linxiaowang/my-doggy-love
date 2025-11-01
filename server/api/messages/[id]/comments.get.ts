import { defineEventHandler, createError } from 'h3'
import prisma from '../../../utils/db'
import { readAuthFromCookie } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  const id = event.context.params?.id as string
  const msg = await prisma.message.findUnique({ where: { id } })
  if (!msg) throw createError({ statusCode: 404, statusMessage: 'message not found' })
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } })
  if (!member || member.coupleId !== msg.coupleId) throw createError({ statusCode: 403, statusMessage: 'forbidden' })

  const all = await prisma.comment.findMany({
    where: { messageId: id },
    orderBy: { createdAt: 'asc' },
    include: { author: true },
  })
  const byId: Record<string, any> = {}
  const roots: any[] = []
  for (const c of all as any[]) {
    byId[c.id] = {
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { id: c.author.id, nickName: c.author.nickName, avatarUrl: c.author.avatarUrl },
      replies: [] as any[],
      parentId: c.parentId,
    }
  }
  for (const c of Object.values(byId)) {
    if ((c as any).parentId && byId[(c as any).parentId]) byId[(c as any).parentId].replies.push(c)
    else roots.push(c)
  }
  return { items: roots }
})


