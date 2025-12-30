import { d as defineEventHandler, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../../_/auth.mjs';
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
  const w = await prisma.wish.findUnique({ where: { id } });
  if (!w) throw createError({ statusCode: 404, statusMessage: "wish not found" });
  const c = await prisma.comment.create({ data: { wishId: id, authorId: payload.userId, content } });
  return { id: c.id };
});

export { comment_post as default };
