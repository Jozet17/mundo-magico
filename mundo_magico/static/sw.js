const CACHE = 'mundo-magico-v1';
const ARCHIVOS = [
    '/',
    '/static/estilos.css',
    '/static/script.js',
    '/static/img/stitch.png',
    '/static/img/spiderman.png',
    '/static/img/lotso.png',
    '/static/img/hulk.png',
    '/static/img/monster.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});