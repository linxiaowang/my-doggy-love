import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) return { user: null };
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return { user: null };
  if (payload.sessionId) {
    const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
    if (!session || session.userId !== user.id) {
      return { user: null };
    }
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActiveAt: /* @__PURE__ */ new Date() }
    });
  }
  const storage = createStorageService();
  const avatarUrl = user.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(user.avatarUrl) : user.avatarUrl : null;
  return {
    user: {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      avatarUrl,
      status: user.status,
      statusUpdatedAt: user.statusUpdatedAt,
      wechatOpenId: user.wechatOpenId,
      wechatNickName: user.wechatNickName,
      wechatAvatar: user.wechatAvatar
    }
  };
});

export { me_get as default };
