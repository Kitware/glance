importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "511a0a0e3c6381e32de258147b4c80be"
  },
  {
    "url": "glance-external-MedicalCornerstone.js",
    "revision": "ce645148cbe23f2bb5aba3ad7cccc7cf"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "64bc72a009855e4ab9f1a7984a701126"
  },
  {
    "url": "index.html",
    "revision": "4536cedbf9a8bfe09b9cf4a6bb1007b2"
  },
  {
    "url": "ParaView.png",
    "revision": "08ff220c5c71d1534ce3de8fe00e8f0c"
  },
  {
    "url": "ParaView.svg",
    "revision": "04d258566ddad05bb950c9ff7600edff"
  },
  {
    "url": "workbox-sw.prod.v2.1.3.js",
    "revision": "a9890beda9e5f17e4c68f42324217941"
  }
]);

workboxSW.router.registerRoute(
  /\.js|\.png|\.wasm$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'staleWhileRevalidateContent',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60 * 26,
    },
  })
);
