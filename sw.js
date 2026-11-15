/* ============================================================================
   SERVICE WORKER (sw.js) — CEO SIVAGANGAI PORTAL & HIGHER EDUCATION GUIDE PWA
   Supports: portal.ceosvg.in & cg.ceosvg.in (Mobile & Desktop Installable App)
   ============================================================================ */
const CACHE_NAME = 'ceosvg-pwa-cache-v4.26';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './01_00_entrance_main.html',
  './02_00_direct_admissions.html',
  './03_institutes.html',
  './04_govt_exams.html',
  './05_direct_careers.html',
  './06_student_support.html',
  './07_resources_external_portals.html'
];

// 1. Install Event: Pre-cache core shell assets gracefully
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          // Ignore individual missing subpages so install never fails on any subdomain
        }
      }
    })
  );
});

// 2. Activate Event: Clean up outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// 3. Fetch Event:
//    - Bypass caching for live Google Apps Script / Firebase / Gemini API calls
//    - Network-First with Cache Fallback for HTML navigation pages (always fresh when online, works offline)
//    - Stale-While-Revalidate for static assets (CSS, JS, Fonts, Images)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept dynamic API / database endpoints
  if (
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('script.googleusercontent.com') ||
    url.hostname.includes('generativelanguage.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com/firestore')
  ) {
    return;
  }

  // HTML Navigation Requests -> Network First, fallback to Cache
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return networkRes;
        })
        .catch(() =>
          caches.match(req).then((cachedRes) => cachedRes || caches.match('./index.html'))
        )
    );
    return;
  }

  // Static Assets (Images, Fonts, Icons, Scripts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => cachedRes);
      return cachedRes || fetchPromise;
    })
  );
});