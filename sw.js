const CACHE_NAME = 'open-lab-tools-v3';
const BASE_URL = new URL('./', self.location.href);
const SHELL = ['./', 'site.webmanifest', 'app-icon.png', 'favicon.png', 'robots.txt'].map(path => new URL(path, BASE_URL).toString());

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(async () => (await caches.match(request)) || (request.mode === 'navigate' ? (await caches.match(new URL('./', self.location.href).toString())) : Response.error())));
});
