const CACHE_NAME = 'bmi-calc-v1';
const ASSETS = [
    './',
    './index.html',
    './assets/style.css',
    './assets/script.js',
    './assets/images/favicon.png',
    './assets/images/icon.png',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
