/* LingaRoo — service worker.
 * Prosty cache-first dla zasobów aplikacji. Nazwa cache niesie numer wersji:
 * podbij LINGAROO_V razem z ?v=N w index.html przy każdym wdrożeniu. */

const LINGAROO_V = 24;
const CACHE = `lingaroo-v${LINGAROO_V}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  `./css/style.css?v=${LINGAROO_V}`,
  `./js/data.js?v=${LINGAROO_V}`,
  `./js/audio.js?v=${LINGAROO_V}`,
  `./js/app.js?v=${LINGAROO_V}`,
  `./icons/icon-192.png?v=${LINGAROO_V}`,
  `./icons/icon-512.png?v=${LINGAROO_V}`,
  `./icons/icon-maskable-512.png?v=${LINGAROO_V}`,
  './assets/roo-hero.png?v=1',
  './assets/roo-pack.png?v=1',
  ...[0, 1, 2, 3, 4].map(n => `./assets/scenes/room-${n}.webp?v=1`),
  ...[0, 1, 2, 3].map(n => `./assets/roo/easel-${n}.webp?v=1`),
  './assets/roo/roo-paint.webp?v=1',
  './assets/roo/roo-paint-done.webp?v=1',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  /* Nawigacja: najpierw sieć, żeby nowe wdrożenie było widoczne od
   * pierwszego otwarcia; cache tylko gdy nie ma internetu. Bez tego
   * cache-first potrafi serwować starą stronę startową w nieskończoność. */
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Fonty Google: sieć, a gdy jej nie ma — to, co już mamy w cache.
   * Brak fontu nie psuje aplikacji (jest zapasowy systemowy krój). */
  if (url.origin !== location.origin) {
    e.respondWith(
      caches.open(CACHE).then(c =>
        fetch(e.request)
          .then(res => { c.put(e.request, res.clone()); return res; })
          .catch(() => c.match(e.request))
      )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: false }).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
    )
  );
});
