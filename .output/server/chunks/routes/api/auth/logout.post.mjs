import { d as defineEventHandler, s as setCookie } from '../../../nitro/nitro.mjs';
import { r as readAuthFromCookie } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const logout_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (payload?.sessionId) {
    try {
      await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => {
      });
    } catch {
    }
  }
  setCookie(event, "mdl_token", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return { ok: true };
});

export { logout_post as default };
