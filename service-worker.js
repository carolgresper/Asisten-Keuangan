const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'applogo192x192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Menyimpan semua file ke cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
