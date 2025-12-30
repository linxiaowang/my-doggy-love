import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
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
  const query = getQuery(event);
  const take = Math.min(parseInt(String(query.take || "20")), 50);
  const cursor = query.cursor ? { id: String(query.cursor) } : void 0;
  const items = await prisma.dailyPost.findMany({
    where: { coupleId: member.coupleId },
    orderBy: { createdAt: "desc" },
    take,
    ...cursor ? { skip: 1, cursor } : {},
    include: { author: true }
  });
  const storage = createStorageService();
  const processedItems = await Promise.all(items.map(async (item) => {
    const mediaUrls = Array.isArray(item.mediaUrls) ? item.mediaUrls : [];
    const convertedUrls = mediaUrls.map((url) => {
      const urlStr = String(url);
      return storage.toAccessibleUrl ? storage.toAccessibleUrl(urlStr) : urlStr;
    });
    const commentCount = await prisma.comment.count({ where: { postId: item.id } });
    return {
      ...item,
      mediaUrls: convertedUrls,
      commentCount,
      author: {
        id: item.author.id,
        nickName: item.author.nickName,
        avatarUrl: item.author.avatarUrl ? storage.toAccessibleUrl ? storage.toAccessibleUrl(item.author.avatarUrl) : item.author.avatarUrl : null
      }
    };
  }));
  return { items: processedItems };
});

export { index_get as default };
