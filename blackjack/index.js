// 1. Create two variables, firstCard and secondCard.
// Set their values to a random number between 2-11

// 2. Create a variable, sum, and set it to the sum of the two cards

let arrCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let hasBlackJack = false;
let isAlive = false;
let firstRnd = true;

let drawnCards = [];
let sum = 0;

let message = "";

const msg = document.getElementById("message-el");
const cardEl = document.getElementById("cards");
const sumEl = document.getElementById("sum");

let player = {
  name: "Player 1",
  chips: 145,
};

const playerEl = document.getElementById("player-el");
playerEl.textContent = player.name + ": $" + player.chips;

// Make this function return a random number between 1 and 13
function getRandomCard() {
  // if 1     -> return 11
  // if 11-13 -> return 10
  let ranCd = Math.floor(Math.random() * 13) + 1;
  console.log(ranCd);
  if (ranCd === 1) {
    return 11;
  } else if (ranCd >= 11) {
    return 10;
  } else {
    return ranCd;
  }
}

console.log("Random BS GO 13!!!: " + getRandomCard());

function startGame() {
  isAlive = true;
  // Generate two random numbers
  // Re-assign the cards and sum variables so that the game can start

  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  drawnCards = [firstCard, secondCard];

  renderGame();
}

function renderGame() {
  cardEl.textContent = `Cards: `;
  sum = 0;

  for (i = 0; i < drawnCards.length; i++) {
    cardEl.textContent += drawnCards[i] + " ";
    sum += drawnCards[i];
  }

  sumEl.textContent = `Sum: ${sum}`;

  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    hasBlackJack = true;
    message = "CONGRATULATIONS!! You've got Blackjack!";
    alert("Blackjack");
    player.chips += 150;
    playerEl.textContent = player.name + ": $" + player.chips;
  } else {
    isAlive = false;
    message = "You lost the game. Want to try again?";
    player.chips -= 10;
    console.log("CHIPSSSSS: " + player.chips);
    playerEl.textContent = player.name + ": $" + player.chips;
  }
  msg.textContent = message;
  console.log(message);

  //CASH OUT!
  if (hasBlackJack === true) {
    console.log("Pay Out initiated.");
    hasBlackJack === false;
  }

  if (isAlive === false) {
    console.log("Money deducted from account.");
  }
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    console.log("Drawing a new card from the deck!");
    // 1. Create a card variable, and hard code its value to a number (2-11)
    let newDraw = getRandomCard();
    sum += newDraw;
    drawnCards.push(newDraw);
    renderGame();
  }
}
