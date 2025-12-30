import { p as prisma } from './db.mjs';

async function createNotification(data) {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      relatedId: data.relatedId,
      content: data.content
    }
  });
}
async function getPartner(coupleId, currentUserId) {
  const members = await prisma.coupleMember.findMany({
    where: { coupleId },
    include: { user: true }
  });
  const partner = members.find((m) => m.userId !== currentUserId);
  return partner?.user || null;
}

export { createNotification as c, getPartner as g };
