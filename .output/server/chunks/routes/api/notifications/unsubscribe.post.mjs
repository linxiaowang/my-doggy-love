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

const unsubscribe_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const { endpoint } = body;
  if (!endpoint) {
    throw createError({ statusCode: 400, statusMessage: "Invalid endpoint" });
  }
  await prisma.pushSubscription.deleteMany({
    where: {
      userId: payload.userId,
      endpoint
    }
  });
  return { success: true };
});

export { unsubscribe_post as default };
