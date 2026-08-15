/* Service worker ASESINO: borra todos los caches viejos y se desregistra.
   La audioguía no usa modo offline por ahora; este SW solo existe para
   limpiar los caches agresivos de versiones anteriores de la app. */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      /* noop */
    }
    try {
      const regs = await self.registration.unregister();
      void regs;
    } catch (e) {
      /* noop */
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', () => {
  /* No cachea nada */
});
