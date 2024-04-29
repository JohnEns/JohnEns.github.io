// Create a person object that contains three keys: name, age, and county.
// Use yourself as an example to set the values for name, age, and country

// Create a function, logData(), that uses the person object to create a
// string in the following format:
// "Per is 35 years old and lives in Norway"

// Call the logData() function to verify that it works

let person = {
  name: "John",
  age: 48,
  country: "Nederland",
};

function logData() {
  return `${person.name} is ${person.age} years old and lives in ${person.country}`;
}

console.log(logData());

let age = 2;

// less than 6 years old -> free
// 6 to 17 years old     -> child discount
// 18 to 26 years old    -> student discount
// 27 to 66 years old    -> full price
// over 66 years old     -> senior citizen discount

// Create a conditional statement (if/else/else if) that logs out the discount
// the passenger will get based upon the value of the age variable

if (age < 6) {
  console.log("free");
} else if (5 < age && age < 18) {
  console.log("child discount");
} else if (17 < age && age < 27) {
  console.log("student discount");
} else if (26 < age && age < 67) {
  console.log("full price");
} else {
  console.log("senior citizen discount");
}

// let largeCountries = ["China", "India", "USA", "Indonesia", "Pakistan"];

let largeCountries = ["Tuvalu", "India", "USA", "Indonesia", "Monaco"];

// You need to help me fixup the largeCountries array so that
// China and Pakistan are added back into their respective places

// Use push() & pop() and their counterparts unshift() & shift()
// Google how to use unshift() and shift()
largeCountries.shift();
largeCountries.unshift("China");
largeCountries.pop();
largeCountries.push("Pakistan");

function doeDat() {
  let txt = "The 5 largest countries in the world:";
  console.log(txt);
  for (i = 0; i < largeCountries.length; i++) {
    console.log("- " + largeCountries[i]);
  }
}

// doeDat();

let dayOfMonth = 13;
let weekday = "Friday";

// If it is Friday the 13th, log out this spooky face: 😱
// Use the logical "AND operator" -> &&

if (dayOfMonth === 13 && weekday === "Friday") {
  console.log("😱");
}

let hands = ["rock", "paper", "scissors"];

// Create a function that returns a random item from the array

function playRPS() {
  //   let x = Math.floor(Math.random() * 3);
  //   return hands[x];

  return hands[Math.floor(Math.random() * 3)];
}

console.log(playRPS());

// 1. Grab the box from the DOM and store it in a variable
// 2. Add a click event listener to the box
// 3. Log out "I want to open the box!" when it's clicked

let boxEL = document.getElementById("box");
// boxEL = document.querySelector("box123");
boxEL.addEventListener("click", function () {
  console.log("I want to open the box!");
});
//
console.log(boxEL);
