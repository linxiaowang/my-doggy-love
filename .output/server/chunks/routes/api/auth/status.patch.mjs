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

const status_patch = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const body = await readBody(event);
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      status: body.status || null,
      statusUpdatedAt: body.status ? /* @__PURE__ */ new Date() : null
    }
  });
  return {
    status: user.status,
    statusUpdatedAt: user.statusUpdatedAt
  };
});

export { status_patch as default };
