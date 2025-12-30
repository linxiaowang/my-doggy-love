import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../_/auth.mjs';
import { p as parseMultipartToFileLikes, c as createStorageService } from '../../../_/storage.mjs';
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

const avatar_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const files = await parseMultipartToFileLikes(event);
  if (!files.length) throw createError({ statusCode: 400, statusMessage: "file required" });
  const storage = createStorageService();
  const saved = await storage.save(files[0], { prefix: "avatars" });
  const user = await prisma.user.update({ where: { id: payload.userId }, data: { avatarUrl: saved.url } });
  const accessibleUrl = storage.toAccessibleUrl ? storage.toAccessibleUrl(user.avatarUrl) : user.avatarUrl;
  return { avatarUrl: accessibleUrl };
});

export { avatar_post as default };
