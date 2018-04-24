'use strict';

var restaurant = undefined;
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
fetchRestaurantFromURL = function (callback) {
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
fillRestaurantHTML = function () {
  var restaurant = arguments.length <= 0 || arguments[0] === undefined ? self.restaurant : arguments[0];

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
fillRestaurantHoursHTML = function () {
  var operatingHours = arguments.length <= 0 || arguments[0] === undefined ? self.restaurant.operating_hours : arguments[0];

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
fillReviewsHTML = function () {
  var reviews = arguments.length <= 0 || arguments[0] === undefined ? self.restaurant.reviews : arguments[0];

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
createReviewHTML = function (review) {
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
fillBreadcrumb = function () {
  var restaurant = arguments.length <= 0 || arguments[0] === undefined ? self.restaurant : arguments[0];

  var breadcrumb = document.getElementById('breadcrumb');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current", "page");
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = function (name, url) {

  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};