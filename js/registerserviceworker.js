var registerServiceWorker = function() {

  if (!navigator.serviceWorker) return;
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
  navigator.serviceWorker.register(window.location.origin+ '/service.js').then(function(reg) {
  }).catch(function(e) {
    console.log('Registration failed! ' + console.log(e));
  });
};


