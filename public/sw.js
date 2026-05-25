const CACHE_NAME = "sync-pwa-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/about",
  "/contact",
  "/routine",
  "/courses",
  "/profile",
  "/manifest.json",
  "/icons/48.png",
  "/icons/72.png",
  "/icons/96.png",
  "/icons/128.png",
  "/icons/192.png",
  "/icons/384.png",
  "/icons/512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Interceptor
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Network-First for API requests (like /api/user/routine)
  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, clone response and save it to cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails (offline), fall back to cache
          console.log("[Service Worker] Offline: serving API from cache for:", requestUrl.pathname);
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stale-While-Revalidate/Cache-First for static assets and page requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Silent catch for offline static requests
        });

      return cachedResponse || fetchPromise;
    })
  );
});
