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
  if (!payload) return { couple: null };
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member) return { couple: null };
  const couple = await prisma.couple.findUnique({ where: { id: member.coupleId } });
  if (!couple) return { couple: null };
  const members = await prisma.coupleMember.findMany({ where: { coupleId: couple.id }, include: { user: true } });
  const storage = createStorageService();
  return {
    couple: {
      id: couple.id,
      code: couple.code,
      members: members.map((m) => ({
        id: m.user.id,
        nickName: m.user.nickName,
        avatarUrl: m.user.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(m.user.avatarUrl) : m.user.avatarUrl : null,
        role: m.role,
        status: m.user.status,
        statusUpdatedAt: m.user.statusUpdatedAt
      }))
    }
  };
});

export { me_get as default };
