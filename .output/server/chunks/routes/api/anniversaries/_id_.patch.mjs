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

const _id__patch = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const id = event.context.params?.id;
  const body = await readBody(event);
  const data = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.coverUrl !== "undefined") data.coverUrl = body.coverUrl;
  if (typeof body.date === "string") data.date = new Date(body.date);
  const a = await prisma.anniversary.update({ where: { id }, data });
  return { id: a.id };
});

export { _id__patch as default };
