import { d as defineEventHandler, c as createError } from '../../../../nitro/nitro.mjs';
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

const read_patch = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const id = event.context.params?.id;
  if (!id) throw createError({ statusCode: 400, statusMessage: "id required" });
  const notification = await prisma.notification.findUnique({
    where: { id }
  });
  if (!notification) {
    throw createError({ statusCode: 404, statusMessage: "notification not found" });
  }
  if (notification.userId !== payload.userId) {
    throw createError({ statusCode: 403, statusMessage: "forbidden" });
  }
  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true }
  });
  return { id: updated.id };
});

export { read_patch as default };
