import DBHelper from './dbhelper';

let restaurants,
  neighborhoods,
  cuisines;
var map;
var markers = [];






/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  //Create some listener 
  myListenersGroup();
  //No changes
  fetchNeighborhoods();
  fetchCuisines();
});


var myListenersGroup = () => {
	//React to filter selections
  var neighborHoodSelect = document.getElementById('neighborhoods-select');
  neighborHoodSelect.addEventListener('change' , function(){
    updateRestaurants();
  });
   var cuisineSelect = document.getElementById('cuisines-select');
  cuisineSelect.addEventListener('change' , function(){
    updateRestaurants();
  }); 
}

/**
 * Fetch all neighborhoods and set their HTML. NO CHANGES
 */
var fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, data) => {
    if (error != null) { // Got an error
      console.error(error);
    } else {
      neighborhoods = data;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML. NO CHANGES
 */
var fillNeighborhoodsHTML = (data = neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');

  data.forEach((neighborhood , i) => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    option.setAttribute("role","option");
    option.setAttribute("aria-posinset", i+1);
    option.setAttribute("aria-setsize" ,data.length);
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML. NO CHANGES
 */
var fetchCuisines = () => {
  DBHelper.fetchCuisines((error, data) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      cuisines = data;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML. NO CHANGES
 */
var fillCuisinesHTML = (data = cuisines) => {
  const select = document.getElementById('cuisines-select');

  data.forEach((cuisine,i) => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    option.setAttribute("role","option");
    option.setAttribute("aria-posinset", i+1);
    option.setAttribute("aria-setsize" ,cuisines.length);
    select.append(option);
  });
}


//NO CHANGES
window.initMap = () => {

  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });


[].slice.apply(document.querySelectorAll('#map a')).forEach(function(item) { 
   item.removeAttribute('tabindex'); 
});

updateRestaurants();
}





/**
 * Update page and map for current restaurants.NO CHANGES
 */
var updateRestaurants = () => {
	
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  
  cSelect.setAttribute("aria-activedescendant","c"+cIndex)
  nSelect.setAttribute("aria-activedescendant","n"+nIndex) 
  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
  
}

/**
 * Clear current restaurants, their HTML and remove their map markers.NO CHANGES
 */
var resetRestaurants = (data) => {
  // Remove all restaurants
  restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  markers.forEach(m => m.setMap(null));
  markers = [];
  restaurants = data;
}

/**
 * Create all restaurants HTML and add them to the webpage.NO CHANGES
 */
var fillRestaurantsHTML = (data = restaurants) => {
  const ul = document.getElementById('restaurants-list');
  data.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.NO CHANGES
 */
var createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  
  const picture = document.createElement('picture');
  li.append(picture);
  
  const first_source = document.createElement('source');
  first_source.setAttribute("media","(min-width:801px)");
  first_source.setAttribute("srcset",DBHelper.imageUrlForRestaurant(restaurant) + "-large-1x.webp 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-large-2x.webp 2x");
  first_source.setAttribute("alt",restaurant.name + " in " + restaurant.neighborhood);
  picture.append(first_source);
  const second_source = document.createElement('source');  
  second_source.setAttribute("media","(min-width:300px)");
  second_source.setAttribute("srcset",DBHelper.imageUrlForRestaurant(restaurant) + "-medium-1x.webp 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-medium-2x.webp 2x");
  second_source.setAttribute("alt",restaurant.name + " in " + restaurant.neighborhood);
  picture.append(second_source); 

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + ".webp";
  image.setAttribute("alt",restaurant.name + " restaurant in " + restaurant.neighborhood);
  picture.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.setAttribute("tabindex","0")
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.setAttribute("tabindex","0")
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.setAttribute("tabindex","0")
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute("aria-label", "View details for " + restaurant.name)
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute("tabindex","0")
  li.append(more)
  return li
}

/**
 * Add markers for current restaurants to the map. NO CHANGES
 */
var addMarkersToMap = (data = restaurants) => {
  data.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    markers.push(marker);
  });

}





