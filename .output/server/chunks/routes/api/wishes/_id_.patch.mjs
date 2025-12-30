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
  let finishedAt;
  if (body.status === "done") finishedAt = /* @__PURE__ */ new Date();
  if (body.status === "todo") finishedAt = null;
  const w = await prisma.wish.update({
    where: { id },
    data: { status: body.status, title: body.title, description: body.description, finishedAt }
  });
  return { id: w.id, status: w.status, finishedAt: w.finishedAt };
});

export { _id__patch as default };
