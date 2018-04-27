var registerServiceWorker = function() {

  if (!navigator.serviceWorker) return;
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  navigator.serviceWorker.register(window.location.origin+ '/build/service.js').then(function(reg) {
	          console.log('Service Worker registration successful with scope: ', reg.scope);
			 
  }).catch(function(e) {
    console.log('Registration failed! ' + console.log(e));
  });
};


