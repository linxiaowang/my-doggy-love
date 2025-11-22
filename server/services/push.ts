import webpush from 'web-push'
import prisma from '../utils/db'

export async function sendPushNotification(userId: string, payload: any) {
  const config = useRuntimeConfig()
  
  if (!config.public.vapidPublicKey || !config.vapidPrivateKey) {
    console.warn('VAPID keys not configured, skipping push notification')
    return
  }

  webpush.setVapidDetails(
    config.vapidSubject || 'mailto:admin@example.com',
    config.public.vapidPublicKey,
    config.vapidPrivateKey
  )

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId }
  })

  const notifications = subscriptions.map(sub => {
    return webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: sub.keys as any
      },
      JSON.stringify(payload)
    ).catch(async (err) => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // 订阅已过期，删除
        await prisma.pushSubscription.delete({ where: { id: sub.id } })
      }
      console.error('Push notification failed:', err)
    })
  })

  await Promise.all(notifications)
}
