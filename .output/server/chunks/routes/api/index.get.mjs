import { d as defineEventHandler } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) return { items: [] };
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member) return { items: [] };
  const items = await prisma.anniversary.findMany({ where: { coupleId: member.coupleId }, orderBy: { date: "asc" } });
  return { items };
});

export { index_get as default };
