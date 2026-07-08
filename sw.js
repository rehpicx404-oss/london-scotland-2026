// Offline support: network-first, cache fallback.
// When online you always get the latest itinerary; offline you get the last copy seen.
const CACHE = 'trip-2026-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return r;
      })
      .catch(() =>
        caches
          .match(e.request, { ignoreSearch: true })
          .then((m) => m || caches.match('./index.html'))
      )
  );
});
