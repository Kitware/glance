importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([]);

workboxSW.router.registerRoute(
  /\.js|\.png|\.wasm$/,
  workboxSW.strategies.networkFirst({
    cacheName: 'networkFirstContent',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60 * 26,
    },
  })
);
