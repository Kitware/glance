importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW({ clientsClaim: true });
workboxSW.precache([
  {
    "url": "glance-external-ITKReader.js",
    "revision": "344446be1b4bb54595b59b0d5c336ca9"
  },
  {
    "url": "glance-external-Workbox.js",
    "revision": "ee7a253315304ec06a7cda6f2065794f"
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
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
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
