const CACHE_NAME = "ridenitt-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add more assets or routes as needed
];

self.addEventListener("push", function (event) {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "Ride NITT";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/logo192.png",
    badge: "/logo192.png",
    data: data.url || "/",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
// Install event: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve cached content when offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found, else fetch from network
      return (
        response ||
        fetch(event.request).catch(() =>
          // Optionally, return a fallback page for navigation requests
          event.request.mode === "navigate"
            ? caches.match("/index.html")
            : undefined
        )
      );
    })
  );
});