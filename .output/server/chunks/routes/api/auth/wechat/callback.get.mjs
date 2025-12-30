import { d as defineEventHandler, c as createError, a as getQuery, e as getCookie, s as setCookie, b as sendRedirect } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/db.mjs';
import { g as getDeviceInfo, T as TOKEN_EXPIRY_SECONDS, s as signToken, a as setAuthCookie } from '../../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const callback_get = defineEventHandler(async (event) => {
  const env = globalThis.process?.env;
  const appId = env?.WECHAT_APPID;
  const appSecret = env?.WECHAT_SECRET;
  if (!appId || !appSecret) {
    throw createError({ statusCode: 500, statusMessage: "\u5FAE\u4FE1\u914D\u7F6E\u4E0D\u5B8C\u6574" });
  }
  const query = getQuery(event);
  const code = query.code;
  const state = query.state;
  const storedState = getCookie(event, "wechat_oauth_state");
  if (!state || state !== storedState) {
    throw createError({ statusCode: 400, statusMessage: "\u65E0\u6548\u7684\u8BF7\u6C42\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55" });
  }
  setCookie(event, "wechat_oauth_state", "", { maxAge: 0 });
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: "\u6388\u6743\u5931\u8D25\uFF0C\u672A\u83B7\u53D6\u5230\u6388\u6743\u7801" });
  }
  try {
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    if (tokenData.errcode || !tokenData.access_token) {
      console.error("\u5FAE\u4FE1\u83B7\u53D6 access_token \u5931\u8D25:", tokenData);
      throw createError({ statusCode: 401, statusMessage: "\u5FAE\u4FE1\u6388\u6743\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" });
    }
    const { access_token, openid, unionid } = tokenData;
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`;
    const userInfoResponse = await fetch(userInfoUrl);
    const userInfo = await userInfoResponse.json();
    if (userInfo.errcode || !userInfo.openid) {
      console.error("\u5FAE\u4FE1\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", userInfo);
      throw createError({ statusCode: 401, statusMessage: "\u83B7\u53D6\u5FAE\u4FE1\u7528\u6237\u4FE1\u606F\u5931\u8D25" });
    }
    let user = await prisma.user.findUnique({ where: { wechatOpenId: openid } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          wechatNickName: userInfo.nickname || null,
          wechatAvatar: userInfo.headimgurl || null,
          wechatUnionId: unionid || null
        }
      });
    } else {
      const nickName = userInfo.nickname || `\u5FAE\u4FE1\u7528\u6237_${openid.substring(0, 8)}`;
      user = await prisma.user.create({
        data: {
          wechatOpenId: openid,
          wechatUnionId: unionid || null,
          wechatNickName: userInfo.nickname || null,
          wechatAvatar: userInfo.headimgurl || null,
          nickName,
          avatarUrl: userInfo.headimgurl || null
        }
      });
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
    const savedRedirect = getCookie(event, "wechat_oauth_redirect");
    const redirectUrl = savedRedirect || query.redirect || "/";
    if (savedRedirect) {
      setCookie(event, "wechat_oauth_redirect", "", { maxAge: 0 });
    }
    return sendRedirect(event, redirectUrl);
  } catch (error) {
    console.error("\u5FAE\u4FE1\u767B\u5F55\u56DE\u8C03\u5904\u7406\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({ statusCode: 500, statusMessage: "\u5FAE\u4FE1\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" });
  }
});

export { callback_get as default };
