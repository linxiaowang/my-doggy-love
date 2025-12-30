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
  const date = body?.date;
  if (!title || !date) throw createError({ statusCode: 400, statusMessage: "title/date required" });
  const a = await prisma.anniversary.create({ data: { coupleId: member.coupleId, title, date: new Date(date), coverUrl: body?.coverUrl } });
  return { id: a.id };
});

export { index_post as default };
