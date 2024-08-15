'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const inputSetsPlayed = document.querySelector('.form__sets--played');
const inputSetsWon = document.querySelector('.form__input-sets--won');
const butDelAll = document.querySelector('.delAll');
const butTrack = document.querySelector('.route');
const trackPopUp = document.getElementById('trackPopUp');

// Classes workout

class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.distance = distance; // in km
    this.duration = duration; // in minutes
    this.coords = coords; // array [lat, lng]
  }

  _setDescription(workout) {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${
      workout.type[0].toUpperCase() + workout.type.slice(1)
    } on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription(this);
  }

  calcPace() {
    //  min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.calcSpeed();
    this._setDescription(this);
  }

  calcSpeed() {
    //  km/min
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Badminton extends Workout {
  type = 'badminton';

  constructor(coords, distance, duration, setsPlayed, setsWon) {
    super(coords, distance, duration);
    this.setsPlayed = setsPlayed;
    this.setsWon = setsWon;
    this.winPerc();
    this._setDescription(this);
  }

  winPerc() {
    this.perc = (this.setsWon / this.setsPlayed) * 100;
    return this.perc;
  }
}
// const run1 = new Running([39, -12], 12, 23, 44);
// console.log(run1);

// const cyc1 = new Cycling([41, -11], 223, 34, 12);
// console.log(cyc1);
////////////////////////////////////////////////////////
// LETOP Application Architecture

class App {
  _map;
  #mapZoomLevel = 17;
  #mapEvent;
  #workOutArray = [];
  #editToggle = false;
  #workOutEditObject;
  #trackerActivated = true;

  constructor() {
    // Get user's positi
    this._getPosition();

    // Get data form local storage
    this._getLocalStorage();

    // Event Handlers
    form.addEventListener('submit', this._newWorkOut.bind(this));
    inputType.addEventListener('change', this.#toggleElevationField);
    containerWorkouts.addEventListener('click', this.#moveToPopUp.bind(this));
    butDelAll.addEventListener('click', this.#delAll.bind(this));
    butTrack.addEventListener('click', this.#trackRoute.bind(this));
  }

  _getLocalStorage() {
    let data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    console.log(data);

    let workOutSwap;

    data.forEach(wo => {
      if (wo.type === 'running') {
        workOutSwap = new Running(
          wo.coords,
          wo.distance,
          wo.duration,
          wo.cadence
        );
        // console.log(workOutSwap);
      }

      if (wo.type === 'cycling') {
        workOutSwap = new Cycling(
          wo.coords,
          wo.distance,
          wo.duration,
          wo.elevGain
        );

        // console.log(workOutSwap);
      }

      if (wo.type === 'badminton') {
        workOutSwap = new Badminton(
          wo.coords,
          wo.distance,
          wo.duration,
          wo.setsPlayed,
          wo.setsWon
        );

        // console.log(workOutSwap);
      }
      workOutSwap.id = wo.id;

      this.#workOutArray.push(workOutSwap);
    });

    // this.#workOutArray = data;
    this.#workOutArray.forEach(w => {
      this.#renderWorkout(w);
    });

    console.log(this.#workOutArray);
  }

  _getPosition() {
    // Geolocation API
    if (navigator.geolocation) {
      //1st arg = succes; 2nd arg = ERROR
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          alert(`Could not get your location.`);
        }
      );
    }
  }

  #loadMap(position) {
    // console.log(position);

    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(latitude, longitude);
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    // console.log(this);
    this._map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // AddEventlistener Leaflet Style
    // this.#map.on('click', this.#showForm.bind(this)); //TODO

    const route = L.polyline([], { color: 'blue' }).addTo(this._map);

    function onLocationFound(e) {
      const latlng = e.latlng;
      route.addLatLng(latlng);
      this._map.setView(latlng, this._map.getZoom());
      L.marker(latlng).addTo(this._map);
      console.log('Checked location!');
    }

    function onLocationError(e) {
      e.message = 'Unknown error fetching location detected.';

      alert(e.message);
    }

    this._map.locate({ setView: true, watch: true, enableHighAccuracy: true });
    this._map.on('locationfound', onLocationFound.bind(this));
    this._map.on('locationerror', onLocationError.bind(this));

    // Create Markers for local storage workouts
    this.#workOutArray.forEach(w => {
      this.#renderWorkoutMarker(w);
    });
  }

  #showForm(mapE) {
    this.#mapEvent = mapE;
    console.log(mapE);

    if (this.#trackerActivated === false) {
      form.classList.remove('hidden');
      inputDistance.focus();
    }

    if (this.#trackerActivated === true) {
      console.log(this);
      this.#trackStart(this);
    }
  }

  _hideForm() {
    inputType.value = 'running';
    inputDistance.closest('.form__row').classList.remove('form__row--hidden');
    inputSetsPlayed.closest('.form__row').classList.add('form__row--hidden');
    inputSetsWon.closest('.form__row').classList.add('form__row--hidden');
    inputCadence.closest('.form__row').classList.add('form__row--hidden');

    // Empty inputs
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputSetsPlayed.value =
      inputSetsWon.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  closeManyFields() {
    inputElevation.closest('.form__row').classList.add('form__row--hidden');
    inputCadence.closest('.form__row').classList.add('form__row--hidden');
    inputSetsPlayed.closest('.form__row').classList.add('form__row--hidden');
    inputSetsWon.closest('.form__row').classList.add('form__row--hidden');
  }

  #toggleElevationField() {
    // inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    // inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

    this.closeManyFields();

    if (inputType.value === 'cycling') {
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
    }

    if (inputType.value === 'running') {
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    }

    if (inputType.value === 'badminton') {
      inputDistance.closest('.form__row').classList.add('form__row--hidden');
      inputSetsPlayed
        .closest('.form__row')
        .classList.remove('form__row--hidden');
      inputSetsWon.closest('.form__row').classList.remove('form__row--hidden');
      inputSetsPlayed.focus();
    }
  }

  _newWorkOut(e) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    const allPositive = (...inputs) => inputs.every(input => input > 0);

    let workout;

    const notValid = 'Inputs have to be a positive number!';
    e.preventDefault(); // LETOP

    // console.log(this.#mapEvent.latlng);
    // const { lat, lng } = this.#mapEvent.latlng;
    // const coords2 = [lat, lng];

    // Get data from form
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;

    //  If running new Running
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      // LETOP Guard CLause
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)

        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert(notValid);

      if (this.#editToggle === false) {
        const { lat, lng } = this.#mapEvent.latlng;

        workout = new Running([lat, lng], distance, duration, cadence); // LETOP
        console.log(workout);
        console.dir(workout);
      }

      if (this.#editToggle === true) {
        workout = this.#workOutEditObject;

        const [lat, lng] = workout.coords;
        console.log(type, lat, lng, distance, duration, cadence);

        // get id to remove old entry
        let idToRemove = workout.id;

        const index = this.#workOutArray
          .map(function (item) {
            return item.id;
          })
          .indexOf(idToRemove);

        // create new workout
        workout = new Running([lat, lng], distance, duration, cadence); // LETOP
        // remove old entry
        this.#workOutArray.splice(index, 1);

        console.log(workout);
        console.dir(workout);
        location.reload();
      }
      // console.log(workout.constructor);
    }

    //  If cycling new Cycling
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert(notValid);

      workout = new Cycling([lat, lng], distance, duration, elevation);
      console.log(workout);
    }

    //  If badminton new Badminton
    if (type === 'badminton') {
      const setsPlayedInput = +inputSetsPlayed.value;
      const setsWonInput = +inputSetsWon.value;

      // Check if data is valid
      if (
        !validInputs(duration, setsPlayedInput, setsWonInput) ||
        !allPositive(duration, setsPlayedInput, setsWonInput)
      )
        return alert(notValid);

      if (setsWonInput > setsPlayedInput)
        return alert('"Sets Won" cannot be greater than "Sets Played"');

      workout = new Badminton(
        [lat, lng],
        0, // 0 for distance
        duration,
        setsPlayedInput,
        setsWonInput
      );
      console.log(workout);
    }

    // Add new object to workoutArray
    this.#workOutArray.push(workout);

    console.log(this.#editToggle);

    // Render workOut on marker
    this.#renderWorkoutMarker(workout); //LETOP

    // Render workOut on list
    this.#renderWorkout(workout); //LETOP

    // Hide form & Clear inputfields
    this._hideForm();
    this.#editToggle === true;
    console.log(this.#workOutArray);

    //  Store workouts in local storage
    this.#setLocalStorage();
  }

  #renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${
          workout.type === 'running'
            ? '🏃‍♂️'
            : workout.type === 'cycling'
            ? '🚴‍♀️'
            : '🏸'
        } ${workout.description}<br>Keep Faith!`
      )
      .openPopup();
  }

  #renderWorkout(workout) {
    let html = `
       <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <div><button class="inline edit" id: "editBut">⚙️ Edit</button></div><div><button class="inline del" id: "delBut">❌ Del</button></div>
          <h2 class="workout__title">${workout.description}</h2>
         
           <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">${
               workout.type === 'running'
                 ? '🏃‍♂️'
                 : workout.type === 'cycling'
                 ? '🚴‍♀️'
                 : '🏸'
             }</span>
          
      
        `;

    if (workout.type === 'running') {
      html += `   
        <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>  
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      </ul>`;
    }

    if (workout.type === 'cycling') {
      html += `
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>  
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
       `;
    }

    if (workout.type === 'badminton') {
      html += `
            <span class="workout__value">${workout.setsPlayed}</span>
            <span class="workout__unit"># played</span>
          </div>  
        <div class="workout__details">
            <span class="workout__icon">📈</span>
            <span class="workout__value">${workout.perc.toFixed(1)}</span>
            <span class="workout__unit">%</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🥇</span>
            <span class="workout__value">${workout.setsWon}</span>
            <span class="workout__unit"># won</span>
          </div>
        </li>
       `;
    }

    form.insertAdjacentHTML('afterend', html);
    let butEd = document.querySelector('.edit');
    butEd.addEventListener('click', this.editWorkOut.bind(this));

    let butDel = document.querySelector('.del');
    butDel.addEventListener('click', this.deleteWorkOut.bind(this));
    // console.log(workout);
  }

  #selectWorkOut(e) {
    // Select workout in DOM List
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    // Find correct workout
    const workout = this.#workOutArray.find(
      work => work.id === workoutEl.dataset.id
    );

    return workout;
  }

  #moveToPopUp(e) {
    const workout = this.#selectWorkOut(e);

    if (!workout) return;
    // Animate towards workout coords
    this._map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });

    workout.click();
    console.log(workout.clicks);
  }

  #setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workOutArray));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  #delAll() {
    const userConfirmed = confirm(
      `Are you sure you want to delete ALL workouts 😮?`
    );

    if (userConfirmed) {
      this.reset();
    }
  }

  editWorkOut(e) {
    console.log('user wants to edit!');

    this.#editToggle = true; //LETOP
    const workout = this.#selectWorkOut(e);
    this.#workOutEditObject = workout;
    console.log(workout);

    // Show form
    form.scrollIntoView({ behavior: 'smooth' });
    form.classList.remove('hidden');
    inputDistance.focus();
    this.closeManyFields();

    // fill in form
    inputDuration.value = workout.duration;

    if (workout.type === 'running') {
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
      inputDistance.closest('.form__row').classList.remove('form__row--hidden');

      inputType.value = 'running';
      inputDistance.value = workout.distance;
      inputCadence.value = workout.cadence;
    }

    if (workout.type === 'cycling') {
      // Make form hidden & visible
      // inputCadence.closest('.form__row').classList.add('form__row--hidden');
      inputDistance.closest('.form__row').classList.remove('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');

      inputType.value = 'cycling';
      inputDistance.value = workout.distance;
      inputElevation.value = workout.elevGain;
    }

    if (workout.type === 'badminton') {
      // Make form hidden & visible
      inputDistance.closest('.form__row').classList.add('form__row--hidden');
      inputSetsPlayed
        .closest('.form__row')
        .classList.remove('form__row--hidden');
      inputSetsWon.closest('.form__row').classList.remove('form__row--hidden');
      inputSetsPlayed.focus();

      inputType.value = 'badminton';
      inputSetsPlayed.value = workout.setsPlayed;
      inputSetsWon.value = workout.setsWon;
    }

    // save workout over old

    // save in local storage
  }

  deleteWorkOut(e) {
    console.log('user wants to DELETE!');
    const workout = this.#selectWorkOut(e);
    console.log(workout);
    const userConfirmed = confirm(
      `Are you sure you want to delete workout ${workout.description}?`
    );

    if (userConfirmed) {
      // User clicked "OK"
      // Perform the delete action here
      // get id to remove old entry

      let idToRemove = workout.id;

      const index = this.#workOutArray
        .map(function (item) {
          return item.id;
        })
        .indexOf(idToRemove);

      this.#workOutArray.splice(index, 1);
      console.log(this.#workOutArray);
      this.#setLocalStorage();
      //  Confirmation

      alert('Workout deleted');
      location.reload();
    } else {
      // User clicked "Cancel"
      alert('Delete action cancelled');
    }
  }

  #onLocationFound(e, route) {
    const latlng = e.latlng;
    route.addLatLng(latlng);
    this._map.setView(latlng, this._map.getZoom());
    L.marker(latlng).addTo(this._map);
  }

  #onLocationError(e) {
    alert(e.message);
  }
  #trackRoute(e) {
    this.#trackerActivated = true;

    //  Message select START point
    trackPopUp.className = 'toast show';
    // fade out
    setTimeout(function () {
      trackPopUp.className = trackPopUp.className.replace('show', '');
    }, 3000);

    /*
    // zoom the map to the polyline
    this.#map.fitBounds(polyline.getBounds());
    */

    /*
    

    */
  }

  #trackStart(e) {
    // const route = L.polyline([], { color: 'blue' }).addTo(this.#map);

    console.log(e);
    console.log(e === this);
    console.log(route);

    /*
    function onLocationFound(e) {
      // console.log(e.#mapEvent.latlng);

      const latlng = this.#mapEvent.latlng;
      route.addLatLng(latlng); // Correct usage: adding a LatLng point to the polyline
      this.#map.setView(latlng, this.#map.getZoom());
      L.marker(latlng).addTo(this.#map); // Correct usage: adding a marker layer to the map
    }

    function onLocationError(e) {
      alert(e.message);
    }

    console.log(this.#map);
    console.log(e.#mapEvent.latlng);
    console.log(e.message);

    // onLocationFound(e);

    onLocationError(e);

    this.#map.locate({ setView: true, watch: true, enableHighAccuracy: true });
    this.#map.on('locationfound', onLocationFound);
    this.#map.on('locationerror', onLocationError);
    console.log('Tracking activated!');
*/
    this.#trackerActivated = false;
  }
}

const app = new App();
console.log(app);

// console.log(form);

// LETOP Planning a Project
// 1. User stories: apps functionality from the users perspective.
// 2. Features
// 3. Put features in flowchart - WHAT we build
// 4. Architecture - HOW we build
// 5. Development - The Building process itself

// LETOP 1. User stories
// 1. As a [type of user] I want [an action] so that [ a benefit]
//              WHO                 WHAT                    WHY

//  VOORBEELD As a user I want to LOG running workouts with locaion, distance,
// time & pace and steps per minute to keep a RUNNING  log

//  VB2: As a user I want to LOG cycling workouts with locaion, distance,
// time & speed  and elevation to keep a CYCLING log

//  VB3: As a user I want to SEE ALL MY workouts at a glance so I
// can track progress over time

//  VB4: As a user I want to SEE ALL MY workouts on a MAP so I
// can track where I workout the most

//  VB5: As a user I want to SEE ALL MY workouts when I leave the app
// and come back later

// LETOP 2. Features
// - map where user clicks for new workout (get location coordinates)
// - Geolocation to display current position (more user friendly)
// - Form to input data Distance, time, pace, steps, speed, elevation
// - Display all workouts in a list
// - Display all workouts on a map
// - Display all workouts persistently thru sessions
//  ==> store info in browser with local storage API = cookies

// LETOP 3. FlowChart
// START WITH EVENTS
// ZIE CHARTS

// LETOP 4. ARCHITECTURE
