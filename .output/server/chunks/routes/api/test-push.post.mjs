import { u as useRuntimeConfig, d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
import webpush from 'web-push';
import { p as prisma } from '../../_/db.mjs';
import { r as readAuthFromCookie } from '../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

async function sendPushNotification(userId, payload) {
  const config = useRuntimeConfig();
  if (!config.public.vapidPublicKey || !config.vapidPrivateKey) {
    console.warn("VAPID keys not configured, skipping push notification");
    return;
  }
  webpush.setVapidDetails(
    config.vapidSubject || "mailto:admin@example.com",
    config.public.vapidPublicKey,
    config.vapidPrivateKey
  );
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId }
  });
  const notifications = subscriptions.map((sub) => {
    return webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: sub.keys
      },
      JSON.stringify(payload)
    ).catch(async (err) => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      }
      console.error("Push notification failed:", err);
    });
  });
  await Promise.all(notifications);
}

const testPush_post = defineEventHandler(async (event) => {
  const payload = readAuthFromCookie(event);
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  await sendPushNotification(payload.userId, {
    title: "\u6D4B\u8BD5\u63A8\u9001",
    body: "\u8FD9\u662F\u4E00\u6761\u6765\u81EA\u540E\u7AEF\u7684\u6D4B\u8BD5\u63A8\u9001\u901A\u77E5",
    url: "/daily"
  });
  return { success: true };
});

export { testPush_post as default };
