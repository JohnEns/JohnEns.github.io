// 1. Create two variables, firstCard and secondCard.
// Set their values to a random number between 2-11

// 2. Create a variable, sum, and set it to the sum of the two cards

let arrCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let hasBlackJack = false;
let isAlive = false;
let firstRnd = true;

let drawnCards = [];
const suits = [
  "_of_hearts.png",
  "_of_clubs.png",
  "_of_diamonds.png",
  "_of_spades.png",
];
let sum = 0;

let message = "";

const msg = document.getElementById("message-el");
const cardEl = document.getElementById("cards");
const sumEl = document.getElementById("sum");
const subMess = document.getElementById("submessage");
const imgCont = document.querySelector(".image-container");
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");

// Card dimensions from the sprite sheet
const CARD_WIDTH = 315; // 4096 / 13
const CARD_HEIGHT = 464; // 1856 / 4

// Suits and their corresponding row index in the sprite
const suitsOb = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3,
};

// Sounds
const sndWinGame = new Audio("/snd/win-game.mp3");
const sndGameOver = new Audio("/snd/game-over.mp3");
const sndError = new Audio("/snd/fout.mp3");
const sndNewCard = new Audio("/snd/yoink.mp3");
// const sndRollDice = new Audio('/snd/dice-rolling.mp3');
const sndNewGame = new Audio("/snd/newGame.mp3");

let player = {
  name: "Player 1",
  chips: 145,
};

const Card = function (value, suit) {
  this.value = value;
  this.suit = suit;

  this.src = `${this.value}${this.suit}`;
};

const playerEl = document.getElementById("player-el");
playerEl.textContent = player.name + ": $" + player.chips;

// Function to display a specific card
function showCard(suit, rank) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  // Calculate the background position
  const x = (rank - 1) * CARD_WIDTH; // rank is from 1 (Ace) to 13 (King)
  const y = suitsOb[suit] * CARD_HEIGHT; // suit is from the suits object

  // Apply background position
  cardElement.style.backgroundPosition = `-${x}px -${y}px`;

  // Add the card to the container
  document.getElementById("cardContainer").appendChild(cardElement);
}

// Make this function return a random number between 1 and 13
function getRandomCard() {
  // if 1     -> return 11
  // if 11-13 -> return 10
  let ranCd = Math.floor(Math.random() * 13) + 1;
  console.log(ranCd);
  return ranCd;
}

// console.log("Random BS GO 13!!!: " + getRandomCard());

function startGame() {
  sndNewGame.play();

  subMess.textContent = "...";
  hasBlackJack = false;
  isAlive = true;
  // Generate two random numbers
  // Re-assign the cards and sum variables so that the game can start

  let firstCard = new Card(
    getRandomCard(),
    suits[`${Math.floor(Math.random() * 4)}`]
  );
  // let firstCard = getRandomCard();
  // let suit = suits[`${Math.floor(Math.random() * 4)}`];
  // console.log(firstCardTEST);

  let secondCard = new Card(
    getRandomCard(),
    suits[`${Math.floor(Math.random() * 4)}`]
  );
  // let secondCard = getRandomCard();
  // let firstCard = 10;
  // let secondCard = 11;
  drawnCards = [firstCard, secondCard];

  renderGame();
}

function renderGame() {
  cardEl.textContent = `Cards: `;
  sum = 0;

  for (i = 0; i < drawnCards.length; i++) {
    // console.log(drawnCards[i].src);  //LETOP
    // console.log(Object.keys(drawnCards[i]));
    // console.log(drawnCards[i]);

    // check numbers for GAME interpretation
    let ranCd = drawnCards[i].value;
    if (ranCd === 1) {
      ranCd = 11;
    } else if (ranCd >= 11) {
      ranCd = 10;
    }
    cardEl.textContent += ranCd + " ";
    sum += ranCd;
  }

  // card1.classList.add("hidden");
  // card2.classList.add("hidden");
  imgCont.replaceChildren();
  drawnCards.forEach((card) => {
    // Create an image element
    let imgElement = document.createElement("img");

    // Set the source, alt, and width attributes
    imgElement.src = `images/cards/${card.src}`;
    imgElement.alt = "card";
    imgElement.width = 200;

    // Append the image to the container
    imgCont.appendChild(imgElement);
  });

  sumEl.textContent = `Sum: ${sum}`;
  subMess.textContent = "...";

  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    hasBlackJack = true;
    message = "CONGRATULATIONS!! You've got Blackjack!";
    alert("Blackjack");
    sndWinGame.play();
    player.chips += 150;
    playerEl.textContent = player.name + ": $" + player.chips;
  } else {
    isAlive = false;
    message = "You lost the game. Want to try again?";
    sndGameOver.play();
    player.chips -= 10;
    // console.log("CHIPSSSSS: " + player.chips);
    subMess.textContent = "You just lost 10 chips 😓";
    playerEl.textContent = player.name + ": $" + player.chips;
  }
  msg.textContent = message;
  console.log(message);

  //CASH OUT!
  if (hasBlackJack === true) {
    // console.log("Pay Out 150 chips initiated. 🥳");
    subMess.textContent = "Pay Out 150 chips initiated. 🥳";
    hasBlackJack === false;
  }

  if (isAlive === false) {
    // console.log("Money deducted from account.");
    subMess.textContent = "Chips deducted from account. 😢";
  }
}

function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    sndNewCard.play();
    // console.log("Drawing a new card from the deck!");
    subMess.textContent = "Drawing a new card from the deck!";
    // 1. Create a card variable, and hard code its value to a number (2-11)
    // let newDraw = getRandomCard();
    let newDraw = new Card(
      getRandomCard(),
      suits[`${Math.floor(Math.random() * 4)}`]
    );
    // sum += newDraw;
    drawnCards.push(newDraw);
    renderGame();
  }
}

showCard("spades", 1);
showCard("clubs", 1);
showCard("clubs", 13);
showCard("hearts", 13);
