import { d as defineEventHandler, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../../_/auth.mjs';
import { c as createNotification } from '../../../../_/notifications.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const comment_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const id = event.context.params?.id;
  const body = await readBody(event);
  const content = body?.content?.trim();
  if (!content) throw createError({ statusCode: 400, statusMessage: "content required" });
  const msg = await prisma.message.findUnique({ where: { id }, include: { author: true } });
  if (!msg) throw createError({ statusCode: 404, statusMessage: "message not found" });
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member || member.coupleId !== msg.coupleId) throw createError({ statusCode: 403, statusMessage: "forbidden" });
  const c = await prisma.comment.create({ data: { messageId: id, authorId: payload.userId, content } });
  if (msg.authorId !== payload.userId) {
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    await createNotification({
      userId: msg.authorId,
      type: "message_comment",
      relatedId: c.id,
      content: `${currentUser?.nickName || "TA"} \u8BC4\u8BBA\u4E86\u4F60\u7684\u7559\u8A00`
    });
  }
  return { id: c.id };
});

export { comment_post as default };
