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