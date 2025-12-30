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

const nickname_patch = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const body = await readBody(event);
  const nickName = body?.nickName?.trim();
  if (!nickName) {
    throw createError({ statusCode: 400, statusMessage: "\u6635\u79F0\u4E0D\u80FD\u4E3A\u7A7A" });
  }
  if (nickName.length > 20) {
    throw createError({ statusCode: 400, statusMessage: "\u6635\u79F0\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC720\u4E2A\u5B57\u7B26" });
  }
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { nickName }
  });
  return {
    id: user.id,
    nickName: user.nickName
  };
});

export { nickname_patch as default };
