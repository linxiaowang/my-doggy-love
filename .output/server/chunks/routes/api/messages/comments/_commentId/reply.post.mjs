import { d as defineEventHandler, c as createError, r as readBody } from '../../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../../../_/auth.mjs';
import { c as createNotification } from '../../../../../_/notifications.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const reply_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const commentId = event.context.params?.commentId;
  const body = await readBody(event);
  const content = body?.content?.trim();
  if (!content) throw createError({ statusCode: 400, statusMessage: "content required" });
  const parent = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { author: true }
  });
  if (!parent) throw createError({ statusCode: 404, statusMessage: "comment not found" });
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member) throw createError({ statusCode: 403, statusMessage: "forbidden" });
  if (parent.messageId) {
    const msg = await prisma.message.findUnique({ where: { id: parent.messageId } });
    if (!msg || msg.coupleId !== member.coupleId) throw createError({ statusCode: 403, statusMessage: "forbidden" });
  }
  const c = await prisma.comment.create({ data: { parentId: commentId, authorId: payload.userId, content, messageId: parent.messageId } });
  if (parent.authorId !== payload.userId) {
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    await createNotification({
      userId: parent.authorId,
      type: "message_comment_reply",
      relatedId: c.id,
      content: `${currentUser?.nickName || "TA"} \u56DE\u590D\u4E86\u4F60\u7684\u8BC4\u8BBA`
    });
  }
  return { id: c.id };
});

export { reply_post as default };
