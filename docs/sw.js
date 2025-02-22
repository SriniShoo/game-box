const CACHE_NAME = 'gamebox-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/tambola.html',
  '/pages/tictactoe.html',
  '/assets/css/common.css',
  '/assets/css/tambola.css',
  '/assets/css/tictactoe.css',
  '/assets/js/header.js',
  '/assets/js/common.js',
  '/assets/js/tambola.js',
  '/assets/js/tictactoe.js',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});