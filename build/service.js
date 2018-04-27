var contentCache = 'uda-test-v1';
var contentImgsCache = "restaurants-content-imgs";

var allCaches = [
  contentCache,
  contentImgsCache
];

//Created a service worker. Special thanks to the service worker lab for developers (expecially for the image cache)

self.addEventListener('install',function(event){

	event.waitUntil(
		caches.open('uda-test-v1').then(function(cache){
			return cache.addAll([
			'js/restaurant_info.js',
			'js/main.js',
			'js/registerserviceworker.js',
			'js/dbhelper.js',
			'js/indexeddb.js',
			'js/idb.js',
			'service.js',			
			'/index.html',
			'data/restaurants.json',
			'/restaurant.html',
			'/manifest.json',
			'css/styles.css',
			'img/1.webp',
			'img/2.webp',			
			'img/3.webp',
			'img/4.webp',
			'img/5.webp',			
			'img/6.webp',
			'img/7.webp',
			'img/8.webp',
			'img/9.webp',			
			'img/10.webp',
			'img/Placeholder.webp',	
			'img/1-medium-1x.webp',
			'img/2-medium-1x.webp',			
			'img/3-medium-1x.webp',
			'img/4-medium-1x.webp',
			'img/5-medium-1x.webp',			
			'img/6-medium-1x.webp',
			'img/7-medium-1x.webp',
			'img/8-medium-1x.webp',
			'img/9-medium-1x.webp',			
			'img/10-medium-1x.webp',	
			'img/Placeholder-medium-1x.webp',	
			'img/1-large-1x.webp',
			'img/2-large-1x.webp',			
			'img/3-large-1x.webp',
			'img/4-large-1x.webp',
			'img/5-large-1x.webp',			
			'img/6-large-1x.webp',
			'img/7-large-1x.webp',
			'img/8-large-1x.webp',
			'img/9-large-1x.webp',
			'img/Placeholder-large-1x.webp',				
			'img/10-large-2x.webp',	
			'img/1-medium-2x.webp',
			'img/2-medium-2x.webp',			
			'img/3-medium-2x.webp',
			'img/4-medium-2x.webp',
			'img/5-medium-2x.webp',			
			'img/6-medium-2x.webp',
			'img/7-medium-2x.webp',
			'img/8-medium-2x.webp',
			'img/9-medium-2x.webp',			
			'img/10-medium-2x.webp',	
			'img/Placeholder-medium-2x.webp',	
			'img/1-large-2x.webp',
			'img/2-large-2x.webp',			
			'img/3-large-2x.webp',
			'img/4-large-2x.webp',
			'img/5-large-2x.webp',			
			'img/6-large-2x.webp',
			'img/7-large-2x.webp',
			'img/8-large-2x.webp',
			'img/9-large-2x.webp',			
			'img/10-large-2x.webp',
			'img/Placeholder-large-2x.webp'
			])
		})

	);
})


self.addEventListener('activate', function(event) {

  event.waitUntil(
    // Get all the cache keys (cacheName)
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurants-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  ); // end event.waitUntil
});


self.addEventListener('fetch', function(event){
  var requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith('/restaurants/')) {
    return;
  }
  if(requestUrl.pathname.startsWith('/img/')){
    event.respondWith(servePhoto(event.request));
    return;
  }
  //Store fetched content | Thanks mentor Mofid for this suggestion!
  event.respondWith(
    caches.open(contentCache).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

function servePhoto(request){
  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(request).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
    });
  });

}