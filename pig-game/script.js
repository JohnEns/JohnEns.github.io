'use strict';
// TODO Implement turn counter for both players
// TODO Reverse current & total score

// Setting up sounds
const sndWinGame = new Audio('/snd/win-game.mp3');
const sndGameOver = new Audio('/snd/game-over.mp3');
const sndError = new Audio('/snd/fout.mp3');
const sndSwitchPlayer = new Audio('/snd/yoink.mp3');
const sndRollDice = new Audio('/snd/dice-rolling.mp3');
const sndNewGame = new Audio('/snd/newGame.mp3');

// Selecting Elements
const elScore0 = document.getElementById('score--0');
const elScore1 = document.getElementById('score--1');
const elDice = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnNewGame = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const elCurrScore0 = document.getElementById('current--0');
const elCurrScore1 = document.getElementById('current--1');

const elPlayer0 = document.querySelector('.player--0');
const elPlayer1 = document.querySelector('.player--1');

// Assigning variables
let currentScore, scores, activePlayer, playing;
let gameState = true;
let activePlayerBoolean = true;

let scorePlayer0 = 0;
let scorePlayer1 = 0;

const hideDice = function () {
  elDice.classList.add('hidden');
};

const showDice = function () {
  elDice.classList.remove('hidden');
};

// Rolling dice function
function roll() {
  if (playing) {
    const die = Math.ceil(Math.random() * 6);
    showDice();
    sndRollDice.play();
    console.log(die);
    elDice.src = `img/dice-${die}.png`;

    if (die === 1) {
      switchPlayer();
    } else {
      currentScore += die;
      //FIXME Cant choose player yet, so just picked player 0
      /*
    if (activePlayerBoolean) {
      elCurrScore0.textContent = currentScore;
    } else {
      elCurrScore1.textContent = currentScore;
    }
    */
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    }
  }
}

function switchPlayer() {
  console.log('Player switched!!');
  sndSwitchPlayer.play();
  activePlayerBoolean = !activePlayerBoolean;
  document.getElementById(`current--${activePlayer}`).textContent = 0;

  // remove active player class
  /*
    document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove('player--active');
  */

  activePlayer = activePlayer === 1 ? 0 : 1;

  // set activeplayer
  elPlayer0.classList.toggle('player--active');
  elPlayer1.classList.toggle('player--active');

  /*
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add('player--active');
    */
  currentScore = 0;
  /*
  if (activePlayerBoolean) {
    elCurrScore1.textContent = 0;
  } else {
    elCurrScore0.textContent = 0;
  }
  */

  // change class player
}

function hold() {
  // let checkScore = `scorePlayer${activePlayer} + currentScore`;
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    /*
  if (activePlayerBoolean) {
    scorePlayer0 += currentScore;
    checkScore = scorePlayer0;
    elScore0.textContent = checkScore;
  } else {
    scorePlayer1 += currentScore;
    checkScore = scorePlayer1;
    elScore1.textContent = checkScore;
  }
  */

    //   score element is not directly empty
    currentScore = 0;
    if (scores[activePlayer] >= 100) playerWins();
    else switchPlayer();
  }
}

function playerWins() {
  gameState = false;
  playing = false;

  hideDice();
  console.log(`Congratz! Player ${activePlayerBoolean ? 1 : 2} has won! 🏆`);
  console.log(`Congratz! Player ${activePlayer + 1} has won! 🏆`);
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add('player--winner');
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove('player--active');
  sndWinGame.play();
}
console.log(elDice);

// Initialization
function initGame() {
  // console.log('new game started!');~
  console.log('new game started!');
  hideDice();
  currentScore = 0;
  scorePlayer0 = scorePlayer1 = 0;
  scores = [0, 0];
  activePlayer = 0;
  activePlayerBoolean = true;
  playing = true;
  gameState = true;

  elScore0.textContent = elScore1.textContent = 0;
  elCurrScore0.textContent = elCurrScore1.textContent = 0;

  elPlayer0.classList.remove('player--winner');
  elPlayer1.classList.remove('player--winner');
  elPlayer0.classList.add('player--active');
  elPlayer1.classList.remove('player--active');
}

// Starting conditions
initGame();

btnNewGame.addEventListener('click', function () {
  sndNewGame.play();
  initGame();
});
btnRoll.addEventListener('click', roll);
btnHold.addEventListener('click', hold);
