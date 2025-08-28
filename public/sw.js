const CACHE_NAME = "wanderlust-cache-v1";
const urlsToCache = [
  "/listings",
  "/css/style.css",
  "/javascript/pwa-register.js",
  "/offline.html"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files:", urlsToCache);
      return cache.addAll(urlsToCache).catch(err => {
        console.error("Cache addAll failed:", err);
      });
    })
  );
  self.skipWaiting();
});


// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache me mil gaya to wahi de do
      if (response) {
        return response;
      }

      // Otherwise network se fetch karo
      return fetch(event.request).catch(() => {
        // Agar network fail ho gaya to offline.html serve karo
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});

const doNotCache = ["/login", "/signup", "/logout"];

self.addEventListener("fetch", event => {
  if (doNotCache.some(path => event.request.url.includes(path))) {
    return event.respondWith(fetch(event.request)); // always fresh fetch
  }
});
