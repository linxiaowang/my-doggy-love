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

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
const create_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const existing = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (existing) throw createError({ statusCode: 400, statusMessage: "already in couple" });
  let code = genCode();
  for (let i = 0; i < 3; i++) {
    const c = await prisma.couple.findUnique({ where: { code } });
    if (!c) break;
    code = genCode();
  }
  const couple = await prisma.couple.create({ data: { code } });
  await prisma.coupleMember.create({ data: { userId: payload.userId, coupleId: couple.id, role: "A" } });
  return { couple: { id: couple.id, code: couple.code } };
});

export { create_post as default };
