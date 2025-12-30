import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { p as prisma } from '../../_/db.mjs';
import { r as readAuthFromCookie } from '../../_/auth.mjs';
import { c as createStorageService } from '../../_/storage.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) return { items: [] };
  const member = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (!member) return { items: [] };
  const storage = createStorageService();
  const items = await prisma.message.findMany({
    where: { coupleId: member.coupleId },
    orderBy: { createdAt: "desc" },
    include: { author: true }
  });
  const mapped = await Promise.all(items.map(async (m) => {
    const count = await prisma.comment.count({ where: { messageId: m.id } });
    return {
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      commentCount: count,
      author: {
        id: m.author.id,
        nickName: m.author.nickName,
        avatarUrl: m.author.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(m.author.avatarUrl) : m.author.avatarUrl : null
      }
    };
  }));
  return { items: mapped };
});

export { index_get as default };
