'use strict';

var restaurants = undefined,
    neighborhoods = undefined,
    cuisines = undefined;
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
fetchNeighborhoods = function () {
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
fillNeighborhoodsHTML = function () {
  var neighborhoods = arguments.length <= 0 || arguments[0] === undefined ? self.neighborhoods : arguments[0];

  var exp_elem_list = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood = function (neighborhood, index) {
    var option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.setAttribute("id", "n" + (index + 1));
    option.setAttribute("role", "option");
    exp_elem_list.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = function () {
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
fillCuisinesHTML = function () {
  var cuisines = arguments.length <= 0 || arguments[0] === undefined ? self.cuisines : arguments[0];

  var select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine = function (cuisine, index) {
    var option = document.createElement('option');
    option.innerHTML = cuisine;
    option.setAttribute("id", "c" + (index + 1));
    option.value = cuisine;
    option.setAttribute("role", "option");
    select.append(option);
  });
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
updateRestaurants = function () {

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
resetRestaurants = function (restaurants) {
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
fillRestaurantsHTML = function () {
  var restaurants = arguments.length <= 0 || arguments[0] === undefined ? self.restaurants : arguments[0];

  var ul = document.getElementById('restaurants-list');
  restaurants.forEach(function (restaurant) {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = function (restaurant) {
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
addMarkersToMap = function () {
  var restaurants = arguments.length <= 0 || arguments[0] === undefined ? self.restaurants : arguments[0];

  restaurants.forEach(function (restaurant) {
    // Add marker to the map
    var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', function () {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};