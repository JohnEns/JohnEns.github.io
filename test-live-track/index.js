"use strict";

const message = document.querySelector(".message");
const butStartTracking = document.getElementById("startTracking");
const butStopTracking = document.getElementById("stopTracking");
const stepsDisplay = document.getElementById("totalSteps");
const caloriesDisplay = document.getElementById("caloriesBurnedSpan");

// Initialize the map
//   Test data Rotterdam Zuid
//   const map = L.map("map").setView([51.878, 4.499], 16);

// Variables
let map;
let route;
let countLoc = 0;
let trackingEnabled = false;
let totalDistance = 0;
let lastLatLng = null;
let lastTime = null;
let burnCalories = 0;

const averageStrideLength = 0.6604; // Average stride length in meters (0.6604 meters gemiddelde vrouw) man 0.7874 TODO
const minDistance = 5; // meters (Voor haversine)
const userWeight = 80; // User's weight in kg (adjust based on actual user data)
const userHeight = 161; // User's height in cm
const userAge = 52; // User's age in years
const gender = "female"; // or "male"

const MET = 7.5; //

// MET value - exercise -> calories burned
//  3.8 MET value for walking at a moderate pace

// 1. Running:
// Moderate Pace (~6 mph or 9.7 km/h): The MET value is approximately 7.5.
// Faster Pace (~8 mph or 12.9 km/h): The MET value is approximately 11.5.

// 2. Cycling:
// Light Effort (~10 mph or 16 km/h): The MET value is approximately 6.8.
// Moderate Effort (~12-14 mph or 19-22.5 km/h): The MET value is approximately 8.0.
// Vigorous Effort (~14-16 mph or 22.5-25.5 km/h): The MET value is approximately 10.0.
// Very Vigorous Effort (~16-20 mph or 25.5-32 km/h): The MET value is approximately 12.0.

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

  console.log("Tracking stopped");
});

// Calc BMR for calorie measurement
function calculateBMR(weight, height, age, gender) {
  if (gender === "male") {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
}

//  Calc the distance between route markers
function calculateDistance(latlng1, latlng2) {
  return map.distance(latlng1, latlng2);
}

function calculateSteps(distance) {
  return Math.round(distance / averageStrideLength);
}

function calculateCalories(distance, speed, weight, height, age, gender) {
  const BMR = calculateBMR(weight, height, age, gender);
  const MET = getMETValueBasedOnSpeed(speed); // Adjust MET based on speed dynamically
  const distanceInKm = distance / 1000;
  const timeInHours = distanceInKm / speed;

  return Math.round((BMR / 24) * MET * timeInHours);
}

function getMETValueBasedOnSpeed(speed) {
  if (speed < 5) return 3.8; // Walking
  if (speed < 9) return 7.5; // Running at 6 mph (~9.7 km/h)
  if (speed >= 9) return 11.5; // Running at 8 mph (~12.9 km/h)
  if (speed >= 12) return 8.0; // Cycling
  // Adjust further if needed for cycling or other activities
  return 3.8; // Default MET value
}

// Example usage
const MET_RUNNING = 7.5; // MET value for running
// const caloriesBurned = calculateCalories(totalDistance, MET_RUNNING, userWeight, userHeight, userAge, gender);

// Define the onLocationFound function
function onLocationFound(e) {
  if (!trackingEnabled) return;

  countLoc++;
  if (countLoc > 4) {
    console.log("Location found!");
    message.innerHTML += `Location found! Teller:${countLoc}<br>`;
  }

  const latlng = e.latlng;
  const currentTime = Date.now(); // Current timestamp in milliseconds

  lastLatLng =
    route.getLatLngs().length > 0
      ? route.getLatLngs()[route.getLatLngs().length - 1]
      : null;

  //   Filter out small movements
  if (route.getLatLngs().length > 0) {
    const lastLatLng = route.getLatLngs()[route.getLatLngs().length - 1];
    const distance = haversineDistance(lastLatLng, latlng);

    if (distance < minDistance) return; // Ignore small movements
  }

  if (lastLatLng && lastTime && trackingEnabled) {
    const distance = calculateDistance(lastLatLng, latlng); // Distance in meters
    const timeElapsed = (currentTime - lastTime) / 1000; // Time in seconds
    const speed = (distance / timeElapsed) * 3.6; // Speed in km/h

    totalDistance += distance;

    // Now calculate calories based on this speed
    const caloriesBurned = calculateCalories(
      totalDistance,
      speed,
      userWeight,
      userHeight,
      userAge,
      gender
    );

    burnCalories = caloriesBurned;

    console.log(caloriesBurned, "verbrande cals");
    // caloriesDisplay.textContent = 25;

    console.log(`Speed: ${speed.toFixed(2)} km/h`);
    message.innerHTML += `Speed: ${speed.toFixed(2)} km/h<br>`;
  }

  route.addLatLng(latlng); // Add point to the polyline
  map.setView(latlng, map.getZoom()); // Center the map on the new location
  L.marker(latlng).addTo(map); // Add a marker at the new location

  lastLatLng = latlng; // Update last position
  lastTime = currentTime; // Update last timestamp

  countLoc > 4 ? (message.innerHTML += `Lat Lon: ${latlng}<br>`) : 1 + 2;

  stepsDisplay.textContent = calculateSteps(totalDistance);
  caloriesDisplay.textContent = burnCalories;
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
          maximumAge: 5000, // Don't use cached positions
          timeout: 10000, // Maximum time to wait for a position (ms)
        });
        map.on("locationfound", onLocationFound);
        map.on("locationerror", onLocationError);
        console.log("gelukt..");
        message.innerHTML += `Live location found! Teller:${countLoc}<br>`;
      }

      // Start the simulation
      // simulateRoute(testRoute);
      liveTrack(map);
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
