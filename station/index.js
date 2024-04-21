let count = 0;

// grab the count-el element, store it in a countEl variable
let countEl = document.getElementById("count");

// 1. Grab the save-el paragrah and store it in a variable called savesEl
let savesEl = document.getElementById("save-el");

function increment() {
  console.log("The button was clicked");
  count++;
  // console.log(count);
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
  // console.log("Save is " + count);
  // console.log("cntSlut is " + cntSlut);
  count = 0;
  countEl.textContent = count;
}
