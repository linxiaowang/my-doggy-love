import { d as defineEventHandler, c as createError, a as getQuery } from '../../../nitro/nitro.mjs';
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
import 'ali-oss';

const signUrl_get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const query = getQuery(event);
  const objectPath = query.path;
  const expires = query.expires ? parseInt(query.expires, 10) : 3600;
  if (!objectPath) {
    throw createError({ statusCode: 400, statusMessage: "path parameter is required" });
  }
  const storage = createStorageService();
  if (storage.getSignedUrl) {
    const signedUrl = storage.getSignedUrl(objectPath, expires);
    return { url: signedUrl };
  }
  throw createError({ statusCode: 400, statusMessage: "signature URL is only available for OSS storage" });
});

export { signUrl_get as default };
