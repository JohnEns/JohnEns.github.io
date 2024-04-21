let count = 0;

// grab the count-el element, store it in a countEl variable
let countEl = document.getElementById("count");

// 1. Grab the save-el paragrah and store it in a variable called savesEl
let savesEl = document.getElementById("save-el");

function increment() {
  console.log("The button was clicked");
  count++;
  console.log(count);
  countEl.textContent = count;
}

// 1. Create a function, save(), which logs out the count when it's called

let saveEl = document.getElementById("save-btn");

function save() {
  // 2. Create a variable that contains both the count and the dash separator, i.e. "12 - "
  // 3. Render the variable in the saveEl using innerText
  // NB: Make sure to not delete the existing content of the paragraph

  let cntSlut = count + " -";
  savesEl.textContent += ` ${cntSlut}`;
  console.log("Save is " + count);
  console.log("cntSlut is " + cntSlut);
  count = 0;
  countEl.textContent = count;
}

/*

let xname = "Linda";
let xgreeting = "Hi there";

// Create a function that logs out "Hi there, Linda!" when called

function greetert() {
  console.log(`${xgreeting}, ${xname}!`);
}

greetert();

let myPoints = 3;

// Create two functions, add3Points() and remove1Point(), and have them
// add/remove points to/from the myPoints variable

function add3Points() {
  myPoints += 3;
}

function remove1Point() {
  myPoints -= 1;
}

add3Points();
add3Points();
add3Points();
remove1Point();
remove1Point();

// Call the functions to that the line below logs out 10
console.log(`PUNTEN: ${myPoints}`);

const arr = [1, 2, 3, 4, 5];

arr.push(6);
arr.unshift(0);
arr.reverse();

console.log(`Array: ${arr}`);
console.log(arr);

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [5, 6, 7, 8, 9, 10];

let arr3 = arr1.concat(arr2.slice(1));

console.log(arr3);

const person = {
  name: "John Doe",
  age: 28,
  isAdmin: true,
};

const todos = [
  { id1: "Buy Milk", ding2: 32 },
  { doe3: "toothpaste", blab: "Ruthless" },
  { id55: 355, name: "Gretd" },
];

const stuper = new Object();

stuper.id = 1;
stuper.name = "Buy Milk";
stuper.compleet = false;

console.log(`Person: ${person}`);
console.log(person + `Person: `);
console.log(person);

person.greet = function () {
  console.log(`Hallo, ik heet ${this.name}`);
};

person.greet();

let result;
result = Object.keys(person);
// result = todos.
result = stuper.hasOwnProperty("name");

console.log(result);
*/

// Try to predict what each of the lines will log out
console.log("2" + 2); // 22
console.log(11 + 7); // 18
console.log(6 + "5"); // 65
console.log("My points: " + 5 + 9); // 14
console.log(2 + 2); //  4
console.log("11" + "14"); // 1114
