!function i(u,a,c){function s(t,e){if(!a[t]){if(!u[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=a[t]={exports:{}};u[t][0].call(o.exports,function(e){return s(u[t][1][e]||e)},o,o.exports,i,u,a,c)}return a[t].exports}for(var l="function"==typeof require&&require,e=0;e<c.length;e++)s(c[e]);return s}({1:[function(e,t,n){"use strict";var r=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();!function(){function n(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n)}r(n,null,[{key:"fetchRestaurants",value:function(t){idbApp.getRestaurants().then(function(e){if(0<e.length)return t(null,e);fetch("http://localhost:1337/restaurants",{}).then(function(e){return console.log("res fetched is: ",e),e.json()}).then(function(n){return(void 0).then(function(e){if(!e)return e;console.log("data fetched is: ",n);var t=e.transaction("ristoranti","readwrite").objectStore("ristoranti");n.forEach(function(e){return t.put(e)}),t.openCursor(null,"prev").then(function(e){return e.advance(30)}).then(function e(t){if(t)return t.delete(),t.continue().then(e)})}),t(null,n)}).catch(function(e){return t(e,null)})})}},{key:"fetchRestaurantById",value:function(r,o){n.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.find(function(e){return e.id==r});n?o(null,n):o("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(r,o){n.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.filter(function(e){return e.cuisine_type==r});o(null,n)}})}},{key:"fetchRestaurantByNeighborhood",value:function(r,o){n.fetchRestaurants(function(e,t){if(e)o(e,null);else{var n=t.filter(function(e){return e.neighborhood==r});o(null,n)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(r,o,i){n.fetchRestaurants(function(e,t){if(e)i(e,null);else{var n=t;"all"!=r&&(n=n.filter(function(e){return e.cuisine_type==r})),"all"!=o&&(n=n.filter(function(e){return e.neighborhood==o})),i(null,n)}})}},{key:"fetchNeighborhoods",value:function(o){n.fetchRestaurants(function(e,n){if(e)o(e,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),t=r.filter(function(e,t){return r.indexOf(e)==t});o(null,t)}})}},{key:"fetchCuisines",value:function(o){n.fetchRestaurants(function(e,n){if(e)o(e,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),t=r.filter(function(e,t){return r.indexOf(e)==t});o(null,t)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return e.photograph?"img/"+e.photograph:"img/Placeholder"}},{key:"mapMarkerForRestaurant",value:function(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:n.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:8880/data/restaurants.json"}}])}()},{}],2:[function(e,p,t){"use strict";!function(){function u(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function i(n,r,o){var i,e=new Promise(function(e,t){u(i=n[r].apply(n,o)).then(e,t)});return e.request=i,e}function e(t,n,e){e.forEach(function(e){Object.defineProperty(t.prototype,e,{get:function(){return this[n][e]}})})}function t(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return i(this[n],e,arguments)})})}function n(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function r(e,r,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[r],(t=i(e,n,arguments)).then(function(e){if(e)return new o(e,t.request)});var e,t})})}function a(e){this._index=e}function o(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function s(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new s(n)}function f(e){this._db=e}e(a,"_index",["name","keyPath","multiEntry","unique"]),t(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),r(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(o,"_cursor",["direction","key","primaryKey","value"]),t(o,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(o.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),u(t._request).then(function(e){if(e)return new o(e,t._request)})})})}),c.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},e(c,"_store",["name","keyPath","indexNames","autoIncrement"]),t(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getAllKeys","count"]),r(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(c,"_store",IDBObjectStore,["deleteIndex"]),s.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},e(s,"_tx",["objectStoreNames","mode"]),n(s,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new s(this._db.transaction.apply(this._db,arguments))},e(f,"_db",["name","version","objectStoreNames"]),n(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(o){[c,a].forEach(function(e){e.prototype[o.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],r=(this._store||this._index)[o].apply(this._store,t.slice(0,-1));r.onsuccess=function(){n(r.result)}}})}),[a,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var r=this,o=[];return new Promise(function(t){r.iterateCursor(e,function(e){e?(o.push(e.value),void 0===n||o.length!=n?e.continue():t(o)):t(o)})})})});var d={open:function(e,t,n){var r=i(indexedDB,"open",[e,t]),o=r.request;return o.onupgradeneeded=function(e){n&&n(new l(o.result,e.oldVersion,o.transaction))},r.then(function(e){return new f(e)})},delete:function(e){return i(indexedDB,"deleteDatabase",[e])}};void 0!==p?p.exports=d:self.idb=d}()},{}],3:[function(e,t,n){"use strict";var r,o=e("./dbhelper");(r=o)&&r.__esModule;navigator.serviceWorker&&navigator.serviceWorker.register("/build/service.js",{scope:"./"}).then(function(){console.log("Service worker has been successfully registered.")}).catch(function(e){console.log("error ",e)})},{"./dbhelper":1}],4:[function(e,t,n){"use strict";var r,o=e("./dbhelper"),i=(r=o)&&r.__esModule?r:{default:r};window.initMap=function(){u(function(e,t){e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),f(),i.default.mapMarkerForRestaurant(self.restaurant,self.map))})};var u=function(n){if(self.restaurant)n(null,self.restaurant);else{var e=d("id");e?i.default.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?(a(),n(null,t)):console.error(e)}):(error="No restaurant id in URL",n(error,null))}},a=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;var t=document.getElementById("restaurant-picture"),n=document.createElement("source");n.setAttribute("media","(min-width:801px)"),n.setAttribute("srcset",i.default.imageUrlForRestaurant(e)+"-large-1x.jpg 1x, "+i.default.imageUrlForRestaurant(e)+"-large-2x.jpg 2x"),t.append(n),n.setAttribute("alt",e.name+" in "+e.neighborhood);var r=document.createElement("source");r.setAttribute("media","(min-width:300px)"),r.setAttribute("srcset",i.default.imageUrlForRestaurant(e)+"-medium-1x.jpg 1x, "+i.default.imageUrlForRestaurant(e)+"-medium-2x.jpg 2x"),r.setAttribute("alt",e.name+" in "+e.neighborhood),t.append(r);var o=document.createElement("img");o.className="restaurant-img",o.src=i.default.imageUrlForRestaurant(e)+".jpg",o.setAttribute("alt",e.name+" in "+e.neighborhood),t.append(o),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&c(),s()},c=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);var i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},s=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var o=document.getElementById("reviews-list");e.forEach(function(e){o.appendChild(l(e))}),t.appendChild(o)},l=function(e){var t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);var r=document.createElement("p");r.innerHTML=e.date,t.appendChild(r);var o=document.createElement("p");o.innerHTML="Rating: "+e.rating,t.appendChild(o);var i=document.createElement("p");return i.innerHTML=e.comments,t.appendChild(i),t},f=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,n.setAttribute("aria-current","page"),t.appendChild(n)},d=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}},{"./dbhelper":1}]},{},[4,1,2,3]);