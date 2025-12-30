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
  const id = event.context.params?.id;
  const post = await prisma.dailyPost.findUnique({ where: { id } });
  if (!post) return { item: null };
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member || member.coupleId !== post.coupleId) throw createError({ statusCode: 403, statusMessage: "forbidden" });
  const storage = createStorageService();
  const mediaUrls = Array.isArray(post.mediaUrls) ? post.mediaUrls : [];
  const convertedUrls = mediaUrls.map((url) => {
    const urlStr = String(url);
    return storage.toAccessibleUrl ? storage.toAccessibleUrl(urlStr) : urlStr;
  });
  return {
    item: {
      ...post,
      mediaUrls: convertedUrls
    }
  };
});

export { _id__get as default };
