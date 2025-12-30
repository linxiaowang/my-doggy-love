import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import { p as parseMultipartToFileLikes, c as createStorageService } from '../../_/storage.mjs';
import { r as readAuthFromCookie } from '../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ali-oss';

const upload_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const files = await parseMultipartToFileLikes(event);
  if (!files.length) throw createError({ statusCode: 400, statusMessage: "file required" });
  const storage = createStorageService();
  const results = [];
  for (const f of files) {
    const saved = await storage.save(f, {
      prefix: "media",
      generateThumbnail: f.type?.startsWith("image/") || false
    });
    if (saved.thumbnailUrl) {
      results.push({
        url: saved.url,
        thumbnailUrl: saved.thumbnailUrl
      });
    } else {
      results.push(saved.url);
    }
  }
  return { urls: results };
});

export { upload_post as default };
