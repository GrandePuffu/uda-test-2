
/*Serving offline content*/

self.addEventListener('install',function(event){
	event.waitUntil(
		caches.open('uda-test-v1').then(function(cache){
			return cache.addAll([
			'/',
			'/index.html',
			'data/restaurants.json',
			'/restaurant.html',
			'/manifest.json',
			'js/all.js',
			'css/styles.css',
			'img/1.jpg',
			'img/2.jpg',			
			'img/3.jpg',
			'img/4.jpg',
			'img/5.jpg',			
			'img/6.jpg',
			'img/7.jpg',
			'img/8.jpg',
			'img/9.jpg',			
			'img/10.jpg',
			'img/Placeholder.jpg',	
			'img/1-medium-1x.jpg',
			'img/2-medium-1x.jpg',			
			'img/3-medium-1x.jpg',
			'img/4-medium-1x.jpg',
			'img/5-medium-1x.jpg',			
			'img/6-medium-1x.jpg',
			'img/7-medium-1x.jpg',
			'img/8-medium-1x.jpg',
			'img/9-medium-1x.jpg',			
			'img/10-medium-1x.jpg',	
			'img/Placeholder-medium-1x.jpg',	
			'img/1-large-1x.jpg',
			'img/2-large-1x.jpg',			
			'img/3-large-1x.jpg',
			'img/4-large-1x.jpg',
			'img/5-large-1x.jpg',			
			'img/6-large-1x.jpg',
			'img/7-large-1x.jpg',
			'img/8-large-1x.jpg',
			'img/9-large-1x.jpg',
			'img/Placeholder-large-1x.jpg',				
			'img/10-large-2x.jpg',	
			'img/1-medium-2x.jpg',
			'img/2-medium-2x.jpg',			
			'img/3-medium-2x.jpg',
			'img/4-medium-2x.jpg',
			'img/5-medium-2x.jpg',			
			'img/6-medium-2x.jpg',
			'img/7-medium-2x.jpg',
			'img/8-medium-2x.jpg',
			'img/9-medium-2x.jpg',			
			'img/10-medium-2x.jpg',	
			'img/Placeholder-medium-2x.jpg',	
			'img/1-large-2x.jpg',
			'img/2-large-2x.jpg',			
			'img/3-large-2x.jpg',
			'img/4-large-2x.jpg',
			'img/5-large-2x.jpg',			
			'img/6-large-2x.jpg',
			'img/7-large-2x.jpg',
			'img/8-large-2x.jpg',
			'img/9-large-2x.jpg',			
			'img/10-large-2x.jpg',
			'img/Placeholder-large-2x.jpg'			
			])
		})
	);
})

self.addEventListener('fetch', function(event){
	event.respondWith(
	caches.match(event.request).then(function(response){
		if(response) return response;
		return fetch(event.request);
	}
	))
	
});