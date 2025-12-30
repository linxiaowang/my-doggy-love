import { d as defineEventHandler, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
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

const join_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const body = await readBody(event);
  const code = body?.code?.trim().toUpperCase();
  if (!code) throw createError({ statusCode: 400, statusMessage: "code required" });
  const already = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (already) throw createError({ statusCode: 400, statusMessage: "already in couple" });
  const couple = await prisma.couple.findUnique({ where: { code } });
  if (!couple) throw createError({ statusCode: 404, statusMessage: "couple not found" });
  await prisma.coupleMember.create({ data: { userId: payload.userId, coupleId: couple.id, role: "B" } });
  return { couple: { id: couple.id, code: couple.code } };
});

export { join_post as default };
