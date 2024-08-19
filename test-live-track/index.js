"use strict";

const message = document.querySelector(".message");
const butStartTracking = document.getElementById("startTracking");
const butStopTracking = document.getElementById("stopTracking");
const stepsDisplay = document.getElementById("totalSteps");
const caloriesDisplay = document.getElementById("caloriesBurned");

// Initialize the map
//   Test data Rotterdam Zuid
//   const map = L.map("map").setView([51.878, 4.499], 16);

let map;
let route;
let countLoc = 0;
let trackingEnabled = false;
let totalDistance = 0;
const averageStrideLength = 0.6604; // Average stride length in meters (0.6604 meters gemiddelde vrouw) man 0.7874 TODO
const minDistance = 5; // meters (Voor haversine)
const userWeight = 70; // User's weight in kg (adjust based on actual user data)
const MET = 3.8; // MET value for walking at a moderate pace

// Add eventListeners
butStartTracking.addEventListener("click", function () {
  trackingEnabled = true;
  totalDistance = 0;
  stepsDisplay.textContent = 0; // Reset steps display
  caloriesDisplay.textContent = 0; // Reset calories display
  message.innerHTML += "Tracking started<br>";
  console.log("Tracking started");
});

butStopTracking.addEventListener("click", function () {
  trackingEnabled = false;
  message.innerHTML += `Tracking stopped. Total steps: ${Math.round(
    totalDistance
  )}.<br>`;
  totalDistance = 0;
  console.log("Tracking stopped");
});

//  Calc the distance between route markers
function calculateDistance(latlng1, latlng2) {
  return map.distance(latlng1, latlng2);
}

function calculateSteps(distance) {
  return Math.round(distance / averageStrideLength);
}

function calculateCalories(distance) {
  const distanceInKm = distance / 1000; // Convert distance to kilometers
  const speed = 5; // Average walking speed in km/h
  const timeInHours = distanceInKm / speed;
  return Math.round(MET * userWeight * timeInHours);
}

// Define the onLocationFound function
function onLocationFound(e) {
  if (!trackingEnabled) return;
  countLoc++;
  if (countLoc > 4) {
    console.log("Location found!");
    message.innerHTML += `Location found! Teller:${countLoc}<br>`;
  }

  const latlng = e.latlng;
  const lastLatLng =
    route.getLatLngs().length > 0
      ? route.getLatLngs()[route.getLatLngs().length - 1]
      : null;

  //   Filter out small movements
  if (route.getLatLngs().length > 0) {
    const lastLatLng = route.getLatLngs()[route.getLatLngs().length - 1];
    const distance = haversineDistance(lastLatLng, latlng);

    if (distance < minDistance) return; // Ignore small movements
  }

  if (lastLatLng) {
    const distance = calculateDistance(lastLatLng, latlng);
    totalDistance += distance;
  }

  route.addLatLng(latlng); // Add point to the polyline
  map.setView(latlng, map.getZoom()); // Center the map on the new location
  L.marker(latlng).addTo(map); // Add a marker at the new location
  countLoc > 4 ? (message.innerHTML += `Lat Lon: ${latlng}<br>`) : 1 + 2;

  const totalSteps = calculateSteps(totalDistance);
  const caloriesBurned = calculateCalories(totalDistance);

  stepsDisplay.textContent = totalSteps;
  caloriesDisplay.textContent = caloriesBurned;
}

function onLocationError(e) {
  alert(`Sorry, location fetching went wrong. 😢`);
}

//  Check Coordinate Calculations:
function haversineDistance(coords1, coords2) {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coords1.lat * Math.PI) / 180;
  const lat2 = (coords2.lat * Math.PI) / 180;
  const deltaLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const deltaLng = ((coords2.lng - coords1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
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
