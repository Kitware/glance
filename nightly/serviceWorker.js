importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "7336e4219f6bcaa64e3c15a0b0cda952"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "d2a01d817c656e9bfdc5ce860567b0f0"
  },
  {
    "url": "index.html",
    "revision": "a471f1e498ad9a1ae30fabd0ac3e14a7"
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
