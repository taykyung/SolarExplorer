// Solar Explorer PWA service worker
const VERSION = 'solar-explorer-v9';
const CORE = [
  './', './index.html', './origin.html', './minigame.html', './memory.html',
  './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './music/memory15.mp3'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: cache first, refresh in background
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // Pages: network first so updates arrive, fall back to cache offline
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r;
    }).catch(async () => (await caches.match(req, { ignoreSearch: true })) || caches.match('./index.html')));
    return;
  }
  // 음악: 캐시에서 구간(Range) 요청도 처리해 오프라인 재생·탐색 가능
  if (url.pathname.endsWith('.mp3')) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      let full = await c.match(url.pathname.replace(/^.*\/music\//, './music/')) || await c.match(req.url);
      if (!full) { try { const r = await fetch(req.url); if (r.ok) { await c.put(req.url, r.clone()); full = r; } else return r; } catch (err) { return fetch(req); } }
      const range = req.headers.get('range');
      if (!range) return full;
      const buf = await full.clone().arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(range) || [];
      const start = +m[1] || 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
      return new Response(buf.slice(start, end + 1), { status: 206, headers: {
        'Content-Type': 'audio/mpeg', 'Content-Length': String(end - start + 1),
        'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`, 'Accept-Ranges': 'bytes' } });
    })());
    return;
  }
  // Other same-origin files: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
