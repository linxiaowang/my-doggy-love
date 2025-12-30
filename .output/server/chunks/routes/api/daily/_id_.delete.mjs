import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const _id__delete = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const id = event.context.params?.id;
  if (!id) throw createError({ statusCode: 400, statusMessage: "id required" });
  const post = await prisma.dailyPost.findUnique({ where: { id } });
  if (!post) throw createError({ statusCode: 404, statusMessage: "post not found" });
  if (post.authorId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: "only author can delete" });
  }
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member || member.coupleId !== post.coupleId) {
    throw createError({ statusCode: 403, statusMessage: "forbidden" });
  }
  await prisma.dailyPost.delete({ where: { id } });
  return { ok: true };
});

export { _id__delete as default };
