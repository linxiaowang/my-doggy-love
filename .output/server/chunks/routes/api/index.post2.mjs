import { d as defineEventHandler, c as createError, r as readBody } from '../../nitro/nitro.mjs';
import { p as prisma } from '../../_/db.mjs';
import { r as readAuthFromCookie } from '../../_/auth.mjs';
import { g as getPartner, c as createNotification } from '../../_/notifications.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const index_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member) throw createError({ statusCode: 400, statusMessage: "not in couple" });
  const body = await readBody(event);
  const content = body?.content?.trim();
  if (!content) throw createError({ statusCode: 400, statusMessage: "content required" });
  const post = await prisma.dailyPost.create({
    data: {
      coupleId: member.coupleId,
      authorId: payload.userId,
      content,
      mediaUrls: body?.mediaUrls || [],
      tags: body?.tags || []
    }
  });
  const partner = await getPartner(member.coupleId, payload.userId);
  if (partner) {
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    await createNotification({
      userId: partner.id,
      type: "daily_posted",
      relatedId: post.id,
      content: `${currentUser?.nickName || "TA"} \u53D1\u8868\u4E86\u65B0\u7684\u65E5\u5E38\u8BB0\u5F55`
    });
  }
  return { id: post.id };
});

export { index_post as default };
