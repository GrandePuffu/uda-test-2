import idb from 'idb';
var dbPromise;
 
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

    static openDatabase() {
    return idb.open('ristoranti' , 1  , function(upgradeDb) {
      upgradeDb.createObjectStore('ristoranti' ,{keyPath: 'id'});
    });
  }
  
  /*Get cached restaurants*/
	static getRestaurants(){
		dbPromise = DBHelper.openDatabase();
		return dbPromise.then(function(db){
		
		//First time?
		if(!db) return;

		var tx = db.transaction('ristoranti');
		var store = tx.objectStore('ristoranti');
		return store.getAll();
    });
  }
  /**
   * Fetch all restaurants.
   */
static fetchRestaurants(callback) {
    DBHelper.getRestaurants().then(function(data){
      // Pass the data
      if(data.length > 0){
        return callback(null , data);
      }

      // Update the cache
      fetch(`http://localhost:1337/restaurants`, {credentials:'same-origin'})
      .then(res => {
        return res.json()})
      .then(data => {
        dbPromise.then(function(db){
          if(!db) return db;
          var tx = db.transaction('ristoranti' , 'readwrite');
          var store = tx.objectStore('ristoranti');
		  //Cursor
          data.forEach(restaurant => store.put(restaurant));
          // Arbitrary limit = 30
          store.openCursor(null , 'prev').then(function(cursor){
            return cursor.advance(30);
          })
          .then(function deleteRest(cursor){
            if(!cursor) return;
            cursor.delete();
            return cursor.continue().then(deleteRest);
          });
        });
        return callback(null,data);
      })
      .catch(err => {
        return callback(err , null)
      });
    });
  } 

  


  /**
   * Fetch a restaurant by its ID. - NO CHANGE
   */
  static fetchRestaurantById(id, callback) {

    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling. - NO CHANGE
   */
  static fetchRestaurantByCuisine(cuisine, callback) {

    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling. - NO CHANGE
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling. - NO CHANGE
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling. - NO CHANGE
   */
  static fetchNeighborhoods(callback) {

    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {

      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)

        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling. - NO CHANGE
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants

    DBHelper.fetchRestaurants((error, restaurants) => {

      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL. - NO CHANGE
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.- NO CHANGE
   */
  static imageUrlForRestaurant(restaurant) {
	  if(restaurant.photograph){
	  return (`img/${restaurant.photograph}`);}
	  else{
		return (`img/Placeholder`);  
	  }
  }

  /**
   * Map marker for a restaurant. - NO CHANGE
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}

module.exports = DBHelper;