'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "232c16d980243d827c239157b13ca5ad",
"assets/assets/fonts/Halimun.ttf": "316ee285f7fbbf7d9b6781e4daa2a02c",
"assets/assets/images/alto_frio.png": "838c46cb31f1d7fb5b714219aabeb31b",
"assets/assets/images/alto_quente.png": "5bf52d8b9ded00fbc3fd42b66120bf18",
"assets/assets/images/ampulheta.png": "c44c5430c4ee518db05c868f4c6d715e",
"assets/assets/images/baixo_frio.png": "3311c85a4f53eb48f51967d8296f138e",
"assets/assets/images/baixo_quente.png": "7481559ddc383f4e7c76fc50d0dcbfa7",
"assets/assets/images/casual%2520dia.png": "cc77faabea376d92f6019d8e43b1b30d",
"assets/assets/images/casual%2520noite.png": "910a8e9356b4a4614c362de57f69e961",
"assets/assets/images/casual.png": "ee73d1f8ac48a44ab1de32546f9febb1",
"assets/assets/images/cl%25C3%25A1ssico.png": "81526d1d805801843eefb47a4185c74a",
"assets/assets/images/criativo.png": "94cd637d33a123a672cc8f57968c5fb2",
"assets/assets/images/dram%25C3%25A1tico.png": "6882dead9f772356e102844eed34d51c",
"assets/assets/images/elegante.png": "977d58e446ba655877ffdcda05bf96d8",
"assets/assets/images/logo.png": "d7678ec2ed6fe08dc1419ae105e94f67",
"assets/assets/images/m%25C3%25A9dio_frio.png": "4304bf51cfc557d70b141ec1942e2af0",
"assets/assets/images/m%25C3%25A9dio_quente.png": "f7a6239ae3d2469f46f35453a0c72562",
"assets/assets/images/oval.png": "1d5bc2e7815dda08243039cb9fc579ad",
"assets/assets/images/ret%25C3%25A2ngulo.png": "abb7b7980a9afa76408650b0b65a6edf",
"assets/assets/images/rom%25C3%25A2ntico.png": "83b1400762c7191da423034918c71071",
"assets/assets/images/sexy.png": "aabc124353068fe73175d00ccf8c70ac",
"assets/assets/images/social%2520dia.png": "d7db21f007d969033a14e0e4a0ffb600",
"assets/assets/images/social%2520noite.png": "374769765c966c37878b11297d0d9a1f",
"assets/assets/images/tri%25C3%25A2ngulo%2520invertido.png": "3d4f95c1f37aceffddc52e3f67464178",
"assets/assets/images/tri%25C3%25A2ngulo.png": "7a8d1136bc0d1516b23aeacbc4cd495e",
"assets/FontManifest.json": "0c56eb55eaad15e038a29e51208753ca",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "550486c80c5e59aaf1ae7ef890b8f467",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "5dec1259ff17b7a95847b559f5f91362",
"/": "5dec1259ff17b7a95847b559f5f91362",
"main.dart.js": "d12ff6515ef39f1d46a20162701cf975",
"manifest.json": "d31c1e24f11043d8b4c4537d4195bf96",
"version.json": "65cf6d685a44d724a6fbb0c0fc092aa9"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
