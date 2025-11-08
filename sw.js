const CACHE_NAME = 'geofence-alerter-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // 실제 빌드 환경에서는 번들링된 JS/CSS 파일을 추가해야 합니다.
  // 이 환경에서는 원본 파일을 캐싱합니다.
  '/index.tsx', 
  // Leaflet CDN 리소스 캐싱
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  // 아이콘 경로 (manifest.json에 명시됨)
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 응답이 있으면 그것을 반환합니다.
        if (response) {
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져옵니다.
        return fetch(event.request).then(
          response => {
            // 응답이 유효하지 않으면 그대로 반환합니다.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제하여 하나는 브라우저에, 다른 하나는 캐시에 저장합니다.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
