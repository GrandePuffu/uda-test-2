"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Common database helper functions.
 */
var DBHelper = function () {
  function DBHelper() {
    _classCallCheck(this, DBHelper);
  }

  _createClass(DBHelper, null, [{
    key: "fetchRestaurants",


    /**
     * Fetch all restaurants.
     */
    value: function fetchRestaurants(callback) {
      //Download from the server
      fetch("http://localhost:1337/restaurants", {}).then(function (response) {
        return response.json();
      }).catch(function (error) {
        //Download from the indexedDB
        window.indexedDB.open("RestaurantsDatabase", 1).onsuccess = function (event) {
          var objectstore = event.target.result.transaction("ristoranti").objectStore("ristoranti");
          var request = objectstore.getAll();
          request.onsuccess = /*(event) => {callback(null,event.target.result)}*/
          function (event) {
            callback(null, event.target.result);
          };
        };
      }).then(function (data) {
        return callback(null, data);
      });
    }
  }, {
    key: "fillOfflineDb",
    value: function fillOfflineDb(obj) {
      offlineContent = obj;
    }

    /**
     * Fetch a restaurant by its ID.
     */

  }, {
    key: "fetchRestaurantById",
    value: function fetchRestaurantById(id, callback) {

      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var restaurant = restaurants.find(function (r) {
            return r.id == id;
          });
          if (restaurant) {
            // Got the restaurant
            callback(null, restaurant);
          } else {
            // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */

  }, {
    key: "fetchRestaurantByCuisine",
    value: function fetchRestaurantByCuisine(cuisine, callback) {

      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          var results = restaurants.filter(function (r) {
            return r.cuisine_type == cuisine;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */

  }, {
    key: "fetchRestaurantByNeighborhood",
    value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          var results = restaurants.filter(function (r) {
            return r.neighborhood == neighborhood;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */

  }, {
    key: "fetchRestaurantByCuisineAndNeighborhood",
    value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var results = restaurants;
          if (cuisine != 'all') {
            // filter by cuisine
            results = results.filter(function (r) {
              return r.cuisine_type == cuisine;
            });
          }
          if (neighborhood != 'all') {
            // filter by neighborhood
            results = results.filter(function (r) {
              return r.neighborhood == neighborhood;
            });
          }
          callback(null, results);
        }
      });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */

  }, {
    key: "fetchNeighborhoods",
    value: function fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          var neighborhoods = restaurants.map(function (v, i) {
            return restaurants[i].neighborhood;
          });
          // Remove duplicates from neighborhoods
          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
            return neighborhoods.indexOf(v) == i;
          });
          callback(null, uniqueNeighborhoods);
        }
      });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */

  }, {
    key: "fetchCuisines",
    value: function fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {
            return restaurants[i].cuisine_type;
          });
          // Remove duplicates from cuisines
          var uniqueCuisines = cuisines.filter(function (v, i) {
            return cuisines.indexOf(v) == i;
          });
          callback(null, uniqueCuisines);
        }
      });
    }

    /**
     * Restaurant page URL.
     */

  }, {
    key: "urlForRestaurant",
    value: function urlForRestaurant(restaurant) {
      return "./restaurant.html?id=" + restaurant.id;
    }

    /**
     * Restaurant image URL.
     */

  }, {
    key: "imageUrlForRestaurant",
    value: function imageUrlForRestaurant(restaurant) {
      if (restaurant.photograph) {
        return "/img/" + restaurant.photograph;
      } else {
        return "/img/Placeholder";
      }
    }

    /**
     * Map marker for a restaurant.
     */

  }, {
    key: "mapMarkerForRestaurant",
    value: function mapMarkerForRestaurant(restaurant, map) {
      var marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP });
      return marker;
    }
  }, {
    key: "DATABASE_URL",


    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */

    get: function get() {
      var port = 8880; // Change this to your server port
      return "http://localhost:" + port + "/data/restaurants.json";
    }
  }]);

  return DBHelper;
}();
"use strict";

var offlineContent;

// In the following line, you should include the prefixes of implementations you want to test.
//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
//window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
//window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)


function openDatabase() {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  var request = window.indexedDB.open("RestaurantsDatabase", 1);

  request.onupgradeneeded = function (event) {
    // Save the IDBDatabase interface 
    var db = event.target.result;
    // Create an objectStore for this database
    var objectStore = db.createObjectStore("ristoranti", { autoIncrement: true });
    fetch("http://localhost:1337/restaurants", {}).then(function (response) {
      return response.json();
    }).then(function (data) {
      objectStore.transaction.oncomplete = function (event) {
        var customerObjectStore = db.transaction("ristoranti", "readwrite").objectStore("ristoranti");
        data.forEach(function (ristorante) {
          var request = customerObjectStore.add(ristorante);
          request.onsuccess = function (event) {
            // event.target.result === ristorante.ssn;

          };
        });
      };
    });
  };
}
'use strict';

var restaurants = void 0,
    neighborhoods = void 0,
    cuisines = void 0;
var map;
var markers = [];

/**
 * ServiceWorker
 */

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function (event) {
  openDatabase();
  registerServiceWorker();
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = function fetchNeighborhoods() {
  DBHelper.fetchNeighborhoods(function (error, neighborhoods) {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
  var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

  var exp_elem_list = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood = function (_neighborhood) {
    function neighborhood(_x2, _x3) {
      return _neighborhood.apply(this, arguments);
    }

    neighborhood.toString = function () {
      return _neighborhood.toString();
    };

    return neighborhood;
  }(function (neighborhood, index) {
    var option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.setAttribute("id", "n" + (index + 1));
    option.setAttribute("role", "option");
    exp_elem_list.append(option);
  }));
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = function fetchCuisines() {
  DBHelper.fetchCuisines(function (error, cuisines) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = function fillCuisinesHTML() {
  var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

  var select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine = function (_cuisine) {
    function cuisine(_x5, _x6) {
      return _cuisine.apply(this, arguments);
    }

    cuisine.toString = function () {
      return _cuisine.toString();
    };

    return cuisine;
  }(function (cuisine, index) {
    var option = document.createElement('option');
    option.innerHTML = cuisine;
    option.setAttribute("id", "c" + (index + 1));
    option.value = cuisine;
    option.setAttribute("role", "option");
    select.append(option);
  }));
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
  updateRestaurants();
  var loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

  [].slice.apply(document.querySelectorAll('#map a')).forEach(function (item) {
    item.removeAttribute('tabindex');
  });
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = function updateRestaurants() {

  var cSelect = document.getElementById('cuisines-select');
  var nSelect = document.getElementById('neighborhoods-select');

  var cIndex = cSelect.selectedIndex;
  var nIndex = nSelect.selectedIndex;

  cSelect.setAttribute("aria-activedescendant", "c" + cIndex);
  nSelect.setAttribute("aria-activedescendant", "n" + nIndex);
  var cuisine = cSelect[cIndex].value;
  var neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = function resetRestaurants(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  var ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(function (m) {
    return m.setMap(null);
  });
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = function fillRestaurantsHTML() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  var ul = document.getElementById('restaurants-list');
  restaurants.forEach(function (restaurant) {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = function createRestaurantHTML(restaurant) {
  var li = document.createElement('li');

  var picture = document.createElement('picture');
  li.append(picture);

  var first_source = document.createElement('source');
  first_source.setAttribute("media", "(min-width:801px)");
  first_source.setAttribute("srcset", DBHelper.imageUrlForRestaurant(restaurant) + "-large-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-large-2x.jpg 2x");
  first_source.setAttribute("alt", restaurant.name + " in " + restaurant.neighborhood);
  picture.append(first_source);
  var second_source = document.createElement('source');
  second_source.setAttribute("media", "(min-width:300px)");
  second_source.setAttribute("srcset", DBHelper.imageUrlForRestaurant(restaurant) + "-medium-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-medium-2x.jpg 2x");
  second_source.setAttribute("alt", restaurant.name + " in " + restaurant.neighborhood);
  picture.append(second_source);

  var image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + ".jpg";
  image.setAttribute("alt", restaurant.name + " restaurant in " + restaurant.neighborhood);
  picture.append(image);

  var name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute("tabindex", "0");
  li.append(name);

  var neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute("tabindex", "0");
  li.append(neighborhood);

  var address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute("tabindex", "0");
  li.append(address);

  var more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute("aria-label", "View details for " + restaurant.name);
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute("tabindex", "0");
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = function addMarkersToMap() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  restaurants.forEach(function (restaurant) {
    // Add marker to the map
    var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', function () {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};
'use strict';

var registerServiceWorker = function registerServiceWorker() {

  if (!navigator.serviceWorker) return;
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  navigator.serviceWorker.register(window.location.origin + '/service.js').then(function (reg) {}).catch(function (e) {
    console.log('Registration failed! ' + console.log(e));
  });
};
'use strict';

var restaurant = void 0;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
  fetchRestaurantFromURL(function (error, restaurant) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      registerServiceWorker();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  var id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, function (error, restaurant) {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = function fillRestaurantHTML() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  var address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  var picture = document.getElementById('restaurant-picture');

  var first_source = document.createElement('source');
  first_source.setAttribute("media", "(min-width:801px)");
  first_source.setAttribute("srcset", DBHelper.imageUrlForRestaurant(restaurant) + "-large-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-large-2x.jpg 2x");
  picture.append(first_source);
  first_source.setAttribute("alt", restaurant.name + " in " + restaurant.neighborhood);
  var second_source = document.createElement('source');
  second_source.setAttribute("media", "(min-width:300px)");
  second_source.setAttribute("srcset", DBHelper.imageUrlForRestaurant(restaurant) + "-medium-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-medium-2x.jpg 2x");
  second_source.setAttribute("alt", restaurant.name + " in " + restaurant.neighborhood);
  picture.append(second_source);

  var image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + ".jpg";
  image.setAttribute("alt", restaurant.name + " in " + restaurant.neighborhood);
  picture.append(image);
  /*
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  */
  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
  var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

  var hours = document.getElementById('restaurant-hours');
  for (var key in operatingHours) {
    var row = document.createElement('tr');

    var day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    var time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = function fillReviewsHTML() {
  var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

  var container = document.getElementById('reviews-container');
  var title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    var noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  var ul = document.getElementById('reviews-list');
  reviews.forEach(function (review) {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = function createReviewHTML(review) {
  var li = document.createElement('li');
  var name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  var date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  var rating = document.createElement('p');
  rating.innerHTML = 'Rating: ' + review.rating;
  li.appendChild(rating);

  var comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = function fillBreadcrumb() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var breadcrumb = document.getElementById('breadcrumb');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current", "page");
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function getParameterByName(name, url) {

  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};