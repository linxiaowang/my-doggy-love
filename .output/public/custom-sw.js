// 自定义 Service Worker 逻辑，用于处理推送通知

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.', event.data.text());

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: '新通知', body: event.data.text() };
  }

  const title = data.title || 'My Doggy Love';
  const options = {
    body: data.body || '你有一条新消息',
    icon: '/pwa-192x192.png',
    badge: '/maskable-icon.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 如果有已经打开的窗口，则聚焦它
      for (const client of clientList) {
        const url = new URL(client.url);
        if (url.pathname === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
