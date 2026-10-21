/**
 * LexiVox AI - Service Worker
 * Enables PWA installation on smartphones (Android/iOS) and background notifications.
 */

const CACHE_NAME = 'lexivox-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/dsa-accessibility.css',
  './css/components.css',
  './css/conversation.css',
  './js/app.js',
  './js/config.js',
  './js/dsa-tools.js',
  './js/diagnostic.js',
  './js/error-tracker.js',
  './js/micro-lessons.js',
  './js/ai-service.js',
  './js/live-dialogue.js',
  './js/analytics.js',
  './js/certificate.js',
  './js/fluency-analyzer.js',
  './js/notifications.js',
  './assets/icon-192.svg',
  './assets/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('PWA caching partial:', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => cachedResponse);
    })
  );
});

// Background Push Notifications handler
self.addEventListener('push', (event) => {
  let data = { title: 'LexiVox AI', body: 'È il momento dei tuoi 20 minuti di inglese parlato!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'assets/icon-192.svg',
    badge: 'assets/icon-192.svg',
    vibrate: [200, 100, 200],
    data: {
      url: './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
