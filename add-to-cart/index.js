import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-570a3-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const addButton = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const shList = document.getElementById("shopping-list");

onValue(shoppingListInDB, function (snapshot) {
  // Challenge: Change the onValue code so that it uses snapshot.exists() to show items when there are items in the database and if there are not displays the text 'No items here... yet'.

  // let shopArray = Object.values(snapshot.val());
  if (snapshot.exists()) {
    let shopArray = Object.entries(snapshot.val());

    console.log(`Boodschappen: ${shopArray}`);

    console.log(snapshot.val());
    clearShoppingListEl();

    for (let i = 0; i < shopArray.length; i++) {
      let currentItem = shopArray[i];
      // Challenge: Make two let variables:
      // currentItemID and currentItemValue and use currentItem to set both of
      // them equal to the correct values.

      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      console.log(currentItem);
      addToDomList(currentItem);
    }
  } else {
    clearShoppingListEl();
    shList.textContent = "No items here... yet";
  }
});

function clearInputFieldEl() {
  inputField.value = "";
}

let clickCount = 0;
let clickTimeout;

function addToDomList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  // shList.innerHTML += `<li>${item}</li>`;
  const newEl = document.createElement("li");
  newEl.tabIndex = 0;
  newEl.textContent = itemValue;
  newEl.addEventListener("click", function () {
    clickCount++;

    if (clickCount === 3) {
      clickCount = 0; // Reset the counter
      clearTimeout(clickTimeout);
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
      remove(exactLocationOfItemInDB);
    } else {
      clickTimeout = setTimeout(() => {
        clickCount = 0; // Reset the counter after a timeout
      }, 400); // 400ms timeout for triple click
    }
  });

  newEl.addEventListener("dblclick", async function () {
    //  check staat key
    if (itemID.startsWith("-")) {
      await changeKeyToOb(itemID);
    } else {
      await resetKeyToWithoutOb(itemID);
    }
    // newEl.classList.toggle("obscure");
  });

  if (itemID.startsWith("ob")) {
    newEl.classList.add("obscure");
  }
  shList.append(newEl);
}

addButton.addEventListener("click", function () {
  let inputValue = inputField.value;
  console.log(inputValue);

  push(shoppingListInDB, inputValue);
  clearInputFieldEl();
  // addToDomList(inputValue);
  // Challenge: Append a new <li> with text content inputValue to the 'shopping-list' <ul>
});
/*
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    let inputValue = inputField.value;
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
});
*/

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    let inputValue = inputField.value;
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
});

function clearShoppingListEl() {
  shList.innerHTML = "";
}

async function changeKeyToOb(oldKey) {
  const db = getDatabase();
  console.log(oldKey);

  // Create the new key by replacing the first character with "ob"
  const newKey = "ob" + oldKey.slice(1);
  console.log(`dit is de newkey ${newKey}`);

  //   let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

  const oldRef = ref(db, `shoppingList/${oldKey}`);
  console.log(oldRef);
  const snapshot = await get(oldRef); // Wait for data retrieval
  if (snapshot.exists()) {
    const data = snapshot.val();
    const newRef = ref(db, `shoppingList/${newKey}`);
    await set(newRef, data); // Wait for data to be set
    await remove(oldRef); // Wait for old data to be removed
    console.log("Key changed successfully");
  } else {
    console.log("No data found at the old key");
  }
}

async function resetKeyToWithoutOb(newKey) {
  const db = getDatabase();
  const oldKey = "-" + newKey.slice(2);
  const newRef = ref(db, `shoppingList/${newKey}`);
  const snapshot = await get(newRef); // Wait for data retrieval
  if (snapshot.exists()) {
    const data = snapshot.val();
    const oldRef = ref(db, `shoppingList/${oldKey}`);
    await set(oldRef, data); // Wait for data to be set
    await remove(newRef); // Wait for new data to be removed
    console.log("Key reset successfully");
  } else {
    console.log("No data found at the new key");
  }
}
/*

// TODO
De input met Enter key invoeren. Code werkt nog niet.

inputField.addEventListener("keypress", enterKey);

function enterKey(e) {
  if (e === 13) {
    let inputValue = inputField.value;
    console.log(inputValue);

    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
}
*/

let scrimbaUsers = {
  "00": "sindre@scrimba.com",
  "01": "per@scrimba.com",
  "02": "frode@scrimba.com",
};

// Challenge: Create a let variable called 'scrimbaUsersEmails' and use one of Object methods to set it equal to an array with the values
let scrimbaUsersEmails = Object.values(scrimbaUsers);
// Challenge: Create a let variable called 'scrimbaUsersIDs' and use one of Object methods to set it equal to an array with the keys
let scrimbaUsersIDs = Object.keys(scrimbaUsers);
// Challenge: Create a let variable called 'scrimbaUsersEntries' and use one of Object methods to set it equal to an array with the both the keys and values
let scrimbaUsersEntries = Object.entries(scrimbaUsers);
