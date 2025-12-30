import { d as defineEventHandler, c as createError, a as getQuery } from '../../nitro/nitro.mjs';
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
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const query = getQuery(event);
  const take = Math.min(parseInt(String(query.take || "20")), 50);
  const cursor = query.cursor ? { id: String(query.cursor) } : void 0;
  const unreadOnly = query.unreadOnly === "true";
  const where = {
    userId: payload.userId
  };
  if (unreadOnly) {
    where.read = false;
  }
  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    ...cursor ? { skip: 1, cursor } : {}
  });
  return { items: notifications };
});

export { index_get as default };
