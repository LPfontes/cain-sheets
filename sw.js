const CACHE_NAME = 'cain-rpg-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './icons.js',
  './manifest.json',
  './css/variables.css',
  './css/components.css',
  './css/sheet.css',
  './css/wizard.css',
  './css/modals.css',
  './css/dice.css',
  './css/responsive.css',
  './js/state.js',
  './js/cain-data.js',
  './js/wizard.js',
  './js/sheet.js',
  './js/modals.js',
  './js/roller.js',
  './js/chat.js',
  './js/logger.js',
  './dice/libs/three.min.js',
  './dice/libs/cannon.min.js',
  './dice/libs/teal.js',
  './dice/dice.js',
  './dice/index.html',
  './dice/styles.css',
  './dice/main.js',
  './dice/assets/background.svg',
  './dice/assets/icon.png',
  './dice/assets/nc93322.mp3',
  './assets/CAIN.png'
];

// Instala o service worker e armazena os recursos estáticos em cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of ASSETS) {
        try { await cache.add(url); } catch (err) {
          console.warn('Cache skip:', url, err.message);
        }
      }
    })
  );
  self.skipWaiting();
});

// Ativa e remove caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
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

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request)
        .then((response) => {
          // Armazena dinamicamente requisições de fontes e arquivos locais com sucesso (status 200)
          if (response && response.status === 200) {
            const url = e.request.url;
            const isLocal = url.startsWith(self.location.origin);
            const isFont = url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');
            if (isLocal || isFont) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, responseClone);
              });
            }
          }
          return response;
        })
        .catch((err) => {
          // Trata falhas de rede (offline) graciosamente sem estourar exceções não capturadas
          console.warn('Recurso indisponível offline:', e.request.url);
          return new Response('Offline', { status: 503, statusText: 'Offline Resource Unavailable' });
        });
    })
  );
});
