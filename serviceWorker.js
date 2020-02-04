"use strict";
//Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v000";
const DATA_CACHE_NAME = "data-cache-v000";
// Add list of files to cache here.
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/js/hourglass-data-00.js",
  "/js/comic-viewer.js",
  "/js/install.js",
  "/css/comic-viewer.css",
  "/issues/00/hourglass_00.jpg",
  "/issues/00/hourglass_01.jpg",
  "/issues/00/hourglass_02.jpg",
  "/issues/00/hourglass_03.jpg",
  "/issues/00/hourglass_04.jpg",
  "/issues/00/hourglass_05.jpg",
  "/issues/00/hourglass_06.jpg",
  "/issues/00/hourglass_07.jpg"
];
//
self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => {
    console.log("[ServiceWorker] Pre-caching offline page");
    return cache.addAll(FILES_TO_CACHE);
  }));
  self.skipWaiting();
});
//
self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");
  evt.waitUntil(caches.keys().then(keyList => {
    return Promise.all(keyList.map(key => {
      if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
        console.log("[ServiceWorker] Removing old cache", key);
        return caches.delete(key);
      }
    }));
  }));
  self.clients.claim();
});
//
self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);
  if(evt.request.url) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(caches.open(DATA_CACHE_NAME).then(cache => {
      return fetch(evt.request).then(response => {
        if(response.status === 200) {
          cache.put(evt.request.url, response.clone());
        }
        return response;
      }).catch(err => {
        // Network request failed, try to get it from the cache.
        return cache.match(evt.request);
      });
    }));
    return;
  }
  evt.respondWith(caches.open(CACHE_NAME).then(cache => {
    return cache.match(evt.request).then(response => {
      return response || fetch(evt.request);
    });
  }));
});
//