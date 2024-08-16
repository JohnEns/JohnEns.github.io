"use strict";

const message = document.querySelector(".message");
// Initialize the map
//   Test data Rotterdam Zuid
//   const map = L.map("map").setView([51.878, 4.499], 16);

let map;
let route;
let countLoc = 0;

// Define the onLocationFound function
function onLocationFound(e) {
  countLoc++;
  if (countLoc > 4) {
    console.log("Location found!");
    message.innerHTML += `Location found! Teller:${countLoc}<br>`;
  }
  const latlng = e.latlng;
  route.addLatLng(latlng); // Add point to the polyline
  map.setView(latlng, map.getZoom()); // Center the map on the new location
  L.marker(latlng).addTo(map); // Add a marker at the new location
  countLoc > 4 ? (message.innerHTML += `Lat Lon: ${latlng}<br>`) : 1 + 2;
}

function onLocationError(e) {
  e.message = `Sorry, location fetching went wrong. 😢`;
  alert(e.message);
}

// Geolocation API
if (navigator.geolocation) {
  // console.log(navigator.geolocation);
  // console.log(this);
  // console.log(navigator.geolocation.getCurrentPosition);

  //1st arg = succes; 2nd arg = ERROR
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      // console.log(latitude, longitude);
      // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];
      // console.log(this);
      map = L.map("map").setView(coords, 16);

      // Add tile layer to the map
      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Initialize an empty polyline for the route
      route = L.polyline([], { color: "blue" }).addTo(map);

      // Simulated route data (an array of latitude and longitude objects)
      const testRoute = [
        { lat: 51.879, lng: 4.499 },
        { lat: 51.88, lng: 4.496 },
        { lat: 51.881, lng: 4.491 },
        { lat: 51.88, lng: 4.485 },
        { lat: 51.88, lng: 4.483 },
      ];
      // console.log(map);

      // Function to simulate location updates with a delay
      function simulateRoute(routePoints, delay = 1000) {
        let index = 0;
        const intervalId = setInterval(() => {
          if (index < routePoints.length) {
            const e = { latlng: routePoints[index] };
            onLocationFound(e); // Call onLocationFound with the simulated location
            index++;
          } else {
            clearInterval(intervalId); // Stop the simulation when all points are done
          }
        }, delay); // Delay between points

        setTimeout(function () {
          liveTrack(map);
        }, 7000);
      }

      // Live tracking func
      function liveTrack(map) {
        console.log(map);
        map.locate({
          setView: true,
          watch: true,
          enableHighAccuracy: true,
          //   maximumAge: 0, // Don't use cached positions
          //   timeout: 10000, // Maximum time to wait for a position (ms)
        });
        map.on("locationfound", onLocationFound);
        map.on("locationerror", onLocationError);
        console.log("gelukt..");
        message.innerHTML += `Live location found! Teller:${countLoc}<br>`;
      }

      // Start the simulation
      simulateRoute(testRoute);
    },
    function () {
      alert(`Could not get your location.`);
    }
  );
}

// test comment

//   console.log(map);
//   if (map) {
//     console.log(map);
//     map.locate({ setView: true, watch: true, enableHighAccuracy: true });
//     map.on("locationfound", onLocationFound);
//     map.on("locationerror", onLocationError);
//   }
//   Test data LONDON
//   const map = L.map("map").setView([51.505, -0.09], 13);
