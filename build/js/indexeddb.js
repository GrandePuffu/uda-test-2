var idbApp = (function() {
  'use strict';

  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  dbPromise = idb.open('restaurants', 1, function(upgradeDb) {;
        upgradeDb.createObjectStore('ristoranti', {keyPath: 'id'});
		addProducts();
  });

  function addProducts() {
	DBHelper.fetchRestaurants((error,rest) => {
    dbPromise.then(function(db) {
      var tx = db.transaction('ristoranti', 'readwrite');

      var store = tx.objectStore('ristoranti');
	  var ristoranti;

	      return Promise.all(rest.map(function(dati) {
          console.log('Adding item: ', dati);
          return store.add(dati);
        }))
		
	  });

	});
  }


  function getRestaurants() {
    return dbPromise.then(function(db) {
      var tx = db.transaction('ristoranti', 'readonly');
      var store = tx.objectStore('ristoranti');
      return store.getAll();
    });
  }








  return {
    dbPromise: (dbPromise),
    addProducts: (addProducts),
    getRestaurants: (getRestaurants),

  };
})();