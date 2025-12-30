import { d as defineEventHandler, c as createError, g as getRequestHeader, s as setCookie, a as getQuery, b as sendRedirect } from '../../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const authorize_get = defineEventHandler(async (event) => {
  const env = globalThis.process?.env;
  const appId = env?.WECHAT_APPID;
  const redirectUri = env?.WECHAT_REDIRECT_URI;
  if (!appId) {
    throw createError({ statusCode: 500, statusMessage: "\u5FAE\u4FE1 AppID \u672A\u914D\u7F6E" });
  }
  let finalRedirectUri = redirectUri;
  if (!finalRedirectUri) {
    const host = getRequestHeader(event, "host") || "localhost:3000";
    const protocol = getRequestHeader(event, "x-forwarded-proto") || "http";
    finalRedirectUri = `${protocol}://${host}/api/auth/wechat/callback`;
  }
  const encodedRedirectUri = encodeURIComponent(finalRedirectUri);
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  setCookie(event, "wechat_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600
    // 10 分钟过期
  });
  const query = getQuery(event);
  const redirect = query.redirect;
  if (redirect) {
    setCookie(event, "wechat_oauth_redirect", redirect, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600
      // 10 分钟过期
    });
  }
  const wechatAuthUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
  return sendRedirect(event, wechatAuthUrl);
});

export { authorize_get as default };
