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

const subscribe_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const { subscription } = body;
  if (!subscription || !subscription.endpoint) {
    throw createError({ statusCode: 400, statusMessage: "Invalid subscription" });
  }
  const existing = await prisma.pushSubscription.findFirst({
    where: {
      userId: payload.userId,
      endpoint: subscription.endpoint
    }
  });
  if (existing) {
    await prisma.pushSubscription.update({
      where: { id: existing.id },
      data: { keys: subscription.keys }
    });
  } else {
    await prisma.pushSubscription.create({
      data: {
        userId: payload.userId,
        endpoint: subscription.endpoint,
        keys: subscription.keys
      }
    });
  }
  return { success: true };
});

export { subscribe_post as default };
