import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { h as hashPassword, g as getDeviceInfo, T as TOKEN_EXPIRY_SECONDS, s as signToken, a as setAuthCookie } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const nickNameInput = body?.nickName?.trim();
    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: "\u90AE\u7BB1\u548C\u5BC6\u7801\u90FD\u662F\u5FC5\u9700\u7684" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError({ statusCode: 400, statusMessage: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" });
    }
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: "\u5BC6\u7801\u957F\u5EA6\u81F3\u5C11\u9700\u89816\u4F4D" });
    }
    const existed = await prisma.user.findUnique({ where: { email } });
    if (existed) {
      throw createError({ statusCode: 409, statusMessage: "\u8BE5\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C" });
    }
    const nickName = nickNameInput || email.split("@")[0];
    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash, nickName } });
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
  } catch (error) {
    if (error?.code === "P1000" || error?.code === "P1001") {
      throw createError({
        statusCode: 503,
        statusMessage: "Database connection failed. Please check database configuration."
      });
    }
    if (error?.statusCode) {
      throw error;
    }
    console.error("Register API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Internal server error"
    });
  }
});

export { register_post as default };
