import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../_/auth.mjs';
import { c as createStorageService } from '../../../_/storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';
import 'ali-oss';

const _id__get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const userId = event.context.params?.id;
  if (!userId) throw createError({ statusCode: 400, statusMessage: "user id required" });
  const currentMember = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!currentMember) throw createError({ statusCode: 403, statusMessage: "not in couple" });
  const targetMember = await prisma.coupleMember.findFirst({
    where: {
      userId,
      coupleId: currentMember.coupleId
    }
  });
  if (!targetMember) throw createError({ statusCode: 403, statusMessage: "user not in your couple" });
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser) throw createError({ statusCode: 404, statusMessage: "user not found" });
  const storage = createStorageService();
  const avatarUrl = targetUser.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(targetUser.avatarUrl) : targetUser.avatarUrl : null;
  return {
    user: {
      id: targetUser.id,
      nickName: targetUser.nickName,
      avatarUrl,
      status: targetUser.status,
      statusUpdatedAt: targetUser.statusUpdatedAt
    }
  };
});

export { _id__get as default };
