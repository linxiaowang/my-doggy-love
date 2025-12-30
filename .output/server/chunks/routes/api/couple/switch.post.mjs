import { d as defineEventHandler, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/db.mjs';
import { r as readAuthFromCookie } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const switch_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) throw createError({ statusCode: 401, statusMessage: "unauthorized" });
  const body = await readBody(event);
  const code = body?.code?.trim().toUpperCase();
  if (!code) throw createError({ statusCode: 400, statusMessage: "code required" });
  const target = await prisma.couple.findUnique({ where: { code } });
  if (!target) throw createError({ statusCode: 404, statusMessage: "target couple not found" });
  const currentMembership = await prisma.coupleMember.findFirst({ where: { userId: payload.userId } });
  if (currentMembership && currentMembership.coupleId === target.id)
    return { couple: { id: target.id, code: target.code } };
  await prisma.$transaction(async (tx) => {
    if (currentMembership) {
      const currentCoupleId = currentMembership.coupleId;
      await tx.coupleMember.delete({ where: { id: currentMembership.id } });
      const leftCount = await tx.coupleMember.count({ where: { coupleId: currentCoupleId } });
      if (leftCount === 0) {
        const relatedCounts = await Promise.all([
          tx.dailyPost.count({ where: { coupleId: currentCoupleId } }),
          tx.wish.count({ where: { coupleId: currentCoupleId } }),
          tx.message.count({ where: { coupleId: currentCoupleId } }),
          tx.anniversary.count({ where: { coupleId: currentCoupleId } })
        ]);
        const hasRelated = relatedCounts.some((c) => c > 0);
        if (!hasRelated) {
          await tx.couple.delete({ where: { id: currentCoupleId } });
        }
      }
    }
    const memberCount = await tx.coupleMember.count({ where: { coupleId: target.id } });
    const role = memberCount === 0 ? "A" : "B";
    await tx.coupleMember.create({ data: { userId: payload.userId, coupleId: target.id, role } });
  });
  return { couple: { id: target.id, code: target.code } };
});

export { switch_post as default };
