import { d as defineEventHandler, c as createError } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../../_/auth.mjs';
import { c as createStorageService } from '../../../../_/storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import 'ali-oss';

const comments_get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const id = event.context.params?.id;
  const post = await prisma.dailyPost.findUnique({ where: { id } });
  if (!post) throw createError({ statusCode: 404, statusMessage: "post not found" });
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: "forbidden" });
  const storage = createStorageService();
  const all = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
    include: { author: true }
  });
  const byId = {};
  const roots = [];
  for (const c of all) {
    byId[c.id] = {
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: {
        id: c.author.id,
        nickName: c.author.nickName,
        avatarUrl: c.author.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(c.author.avatarUrl) : c.author.avatarUrl : null
      },
      replies: [],
      parentId: c.parentId
    };
  }
  for (const c of Object.values(byId)) {
    if (c.parentId && byId[c.parentId]) byId[c.parentId].replies.push(c);
    else roots.push(c);
  }
  return { items: roots };
});

export { comments_get as default };
