const CACHE = "shortener-v1";
self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE).then(c => c.addAll(["/","/index.html","/styles.css","/app.js","/logo.png"]))
  );
  self.skipWaiting();
});
self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
