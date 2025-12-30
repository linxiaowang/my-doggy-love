import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { h as hashPassword, g as getDeviceInfo, s as signToken, a as setAuthCookie, T as TOKEN_EXPIRY_SECONDS } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "\u90AE\u7BB1\u548C\u5BC6\u7801\u90FD\u662F\u5FC5\u9700\u7684" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" });
  }
  const passwordHash = hashPassword(password);
  const user = await prisma.user.findFirst({ where: { email, passwordHash } });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF" });
  }
  const { userAgent, ipAddress, deviceInfo } = getDeviceInfo(event);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_SECONDS * 1e3);
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      deviceInfo,
      userAgent,
      ipAddress,
      expiresAt
    }
  });
  const token = signToken({ userId: user.id, sessionId: session.id, iat: Date.now() });
  setAuthCookie(event, token);
  return { user: { id: user.id, email: user.email, nickName: user.nickName, avatarUrl: user.avatarUrl } };
});

export { login_post as default };
