let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []
var observer;
var numSteps = 20.0;

/**
 * ServiceWorker
 */
registerServiceWorker();


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
 setIntersectObservers();
  myListenersGroup();
  fetchNeighborhoods();
  fetchCuisines();
});


var myListenersGroup = () => {
  var neighborHoodSelect = document.getElementById('neighborhoods-select');
  neighborHoodSelect.addEventListener('change' , function(){
    updateRestaurants();
  });
   var cuisineSelect = document.getElementById('cuisines-select');
  cuisineSelect.addEventListener('change' , function(){
    updateRestaurants();
  }); 
}

var setIntersectObservers = () => {
  var options = {
    root: document.querySelector('#scrollArea'),
    rootMargin: '0px',
    threshold: buildThresholdList()
  }

  observer = new IntersectionObserver(handleIntersect, options);
}

var buildThresholdList = () => {
  var thresholds = [];

  for (var i=1.0; i<=numSteps; i++) {
    var ratio = i/numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

var handleIntersect = (entries , observer) => {
  entries.forEach((entry) => {
    if(entry.intersectionRatio > 0.25){
      entry.target.classList.remove('hidden');
      entry.target.classList.add('show');
    }
  });
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const exp_elem_list = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood = (neighborhood,index) => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
	option.setAttribute("id","n"+(index+1));
	option.setAttribute("role","option");
    exp_elem_list.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine = (cuisine,index) => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
	option.setAttribute("id","c"+(index+1));
    option.value = cuisine;
	option.setAttribute("role","option")
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
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
 updateRestaurants();

[].slice.apply(document.querySelectorAll('#map a')).forEach(function(item) { 
   item.removeAttribute('tabindex'); 
});

 
}






/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
	
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
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  
  const picture = document.createElement('picture');
  li.append(picture);
  
  const first_source = document.createElement('source');
  first_source.setAttribute("media","(min-width:801px)");
  first_source.setAttribute("srcset",DBHelper.imageUrlForRestaurant(restaurant) + "-large-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-large-2x.jpg 2x");
  first_source.setAttribute("alt",restaurant.name + " in " + restaurant.neighborhood);
  picture.append(first_source);
  const second_source = document.createElement('source');  
  second_source.setAttribute("media","(min-width:300px)");
  second_source.setAttribute("srcset",DBHelper.imageUrlForRestaurant(restaurant) + "-medium-1x.jpg 1x, " + DBHelper.imageUrlForRestaurant(restaurant) + "-medium-2x.jpg 2x");
  second_source.setAttribute("alt",restaurant.name + " in " + restaurant.neighborhood);
  picture.append(second_source); 

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + ".jpg";
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
  observer.observe(li);
  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}





