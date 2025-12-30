import { d as defineEventHandler, c as createError, r as readBody } from '../../nitro/nitro.mjs';
import { p as prisma } from '../../_/db.mjs';
import { r as readAuthFromCookie } from '../../_/auth.mjs';
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
  const title = body?.title?.trim();
  if (!title) throw createError({ statusCode: 400, statusMessage: "title required" });
  const w = await prisma.wish.create({ data: { coupleId: member.coupleId, title, description: body?.description } });
  return { id: w.id };
});

export { index_post as default };
