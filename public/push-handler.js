self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'Hallaqi', body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'Hallaqi';
  const options = {
    body: payload.body || payload.message || 'لديك تحديث جديد',
    icon: '/logo-icon-192.png',
    badge: '/logo-icon-192.png',
    tag: payload.tag || `hallaqi-${Date.now()}`,
    data: { url: payload.url || '/?screen=notifications' },
    dir: 'rtl',
    lang: 'ar',
    renotify: Boolean(payload.renotify),
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const destination = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(client => client.url.startsWith(self.location.origin));
      if (existing) {
        existing.navigate(destination);
        return existing.focus();
      }
      return self.clients.openWindow(destination);
    })
  );
});
