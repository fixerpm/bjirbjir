// ============================================================================
// OSON PRAVA — SERVICE WORKER (PWA Offline Cache & App Shell)
// ============================================================================

const CACHE_NAME = 'osonprava-v3.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './favicon-16.png',
  './favicon-32.png',
  './favicon-192.png',
  './favicon-512.png',
  './css/style.css',
  './css/tailwind.css',
  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './vendor/fonts/sora-latin-wght-normal.woff2',
  './vendor/fonts/sora-latin-ext-wght-normal.woff2',
  './vendor/fonts/inter-latin-wght-normal.woff2',
  './vendor/fonts/inter-latin-ext-wght-normal.woff2',
  './vendor/pdf/html2canvas.min.js',
  './vendor/pdf/jspdf.umd.min.js',
  './js/loading.js',
  './js/data.js',
  './js/storage.js',
  './js/utils.js',
  './js/auth.js',
  './js/sound.js',
  './js/fines.js',
  './js/ai-tutor.js',
  './js/signs.js',
  './js/lessons.js',
  './js/tests.js',
  './js/exam.js',
  './js/profile.js',
  './js/ui.js',
  './js/simulator.js',
  './js/certificate.js',
  './js/checkout.js',
  './js/pitch.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll non-critical error:', err);
      });
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
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For app assets on same origin, try network first, fallback to cache
  if (url.origin === location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Boshqa domenlardagi resurslar (masalan, tashqi rasmlar) - cache first, tarmoq zaxira
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
    })
  );
});
