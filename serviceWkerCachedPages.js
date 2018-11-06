// This file is the Actual Service worker

const cacheVersion = 'v1';
// This is basically naming the cache

// This is a variable of all the assets. We need to house all of the
// files for this project in this array
const cacheAssets = [
  'index.html',
  'restaurant.html',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/data/restaurants.json',
  '/css/styles.css'
];



//Call Install Event

// need to attache an event listener to the actual service Worker
self.addEventListener('install', e =>{
  console.log('Service Worker: Installed');
              // =======Here we are setting up our cache=======
  e.waitUntil(
    caches
     .open(cacheVersion)
      .then(cache =>{
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});


// Call Activate Event
self.addEventListener('activate', e =>{
  console.log('Service Worker: Activated');
});


// Call Fetch event
// =======Here we are setting up the files to show when  app goes offline=======

self.addEventListener('fetch', function(e){
  console.log("[ServiceWorker] Fetching", e.request);

  e.respondWith(
    // First you want to do is check if the requested item already exists or not
    caches.match(e.request).then(function(response){

      // This part establishes that the item was in the cache and it was pulling it from there
      if (response) {
        console.log ("[ServiceWorker] Found in cache",e.request);
        return response;
      }
      // if the item is not found in the cache when we fetch it we should push it into the caches
      // so next time the site doesnt need to go fetch it again rather just retrieve it from your caches
      // you need to clone the request and clone the response
      // you need to clone both is bc its a stream and if you want to use it more than once you need to clone it
      var requestClone = e.request.clone();

      // reason you need to clone your request and then create a response clone is because you are basically
      // taking the request clone and reusing it and placing it into the cache and the only way to reuse the data is
      // by cloning the response as a new variable

      fetch(requestClone)
        .then(function(response){
          // If you dont get any response
          if (!response){
            console.log("[ServiceWorker] No response from fetch");
            return response;
          }
          // If you do get a response
          var responseClone = response.clone();
           // you need to open the cache
           caches.open(cacheVersion).then(function(cache){
             cache.put(e.request, responseClone);
             return response;
           });
        })
        // if the fetch doesnt work this is just a catch for it
        .catch(function(err){
          console.log("[ServiceWorker] Error Fetching and Caching New Data");
        })
    })

  )
})
// =========== Youtube Video from Bitsofcode ========
