'use strict';

//TODO Integreer score up en down knoppen voor mobiel!

const winGameSnd = new Audio('win-game.mp3');
const gameOverSnd = new Audio('game-over.mp3');
const errorSnd = new Audio('fout.mp3');
const againButton = document.querySelector('.again');
const highScoreCounter = document.querySelector('.highscore');
const numberDisplay = document.querySelector('.number');

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};
const scoreDisplay = document.querySelector('.score');
let scoreCounter = 20;
let highScore = 0;

let secretNumber = Math.trunc(Math.random() * 20) + 1;
console.log(secretNumber);

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);
  if (scoreCounter <= 0) {
    displayMessage(`You already lost. 🥺 Press 'Again!'.`);
    gameOverSnd.play();
    document.querySelector('body').style.backgroundColor = '#e71414';
  } else {
    //FIXME ALs guess input = 0, dan krijg je ook deze boodschap.
    //   In array stoppen en checken of array[0] bestaat? Clunky.
    if (!guess) {
      displayMessage('❌ No input given.');
      errorSnd.play();

      // input outside of play range
    } else if (guess < 0 || guess > 20) {
      displayMessage(`Please enter a number between 1 and 20. 🧐`);
      errorSnd.play();

      // correct number given!
    } else if (guess === secretNumber) {
      displayMessage(`Congratulations! That's correct! 🏆`);
      winGameSnd.play();
      document.querySelector('body').style.backgroundColor = '#60b347';
      numberDisplay.style.width = '30rem';
      numberDisplay.textContent = secretNumber;
      if (scoreCounter > highScore) highScore = scoreCounter;
      highScoreCounter.textContent = highScore;
      // guess too high
    } else if (guess !== secretNumber) {
      scoreCounter--;
      scoreDisplay.textContent = scoreCounter;
      if (scoreCounter > 0) {
        displayMessage(
          guess > secretNumber
            ? `Your guess is too high. 📈`
            : `Your guess is too low. 📉`
        );
      } else {
        displayMessage(`You lost the game. 😢`);
        gameOverSnd.play();
      }

      //   FIXME Na lost game gaat game door.
    }
  }
});

againButton.addEventListener('click', restartGame);

function restartGame() {
  console.log('Restart activated');

  scoreCounter = 20;
  scoreDisplay.textContent = scoreCounter;
  document.querySelector('body').style.backgroundColor = '#222';
  numberDisplay.style.width = '15rem';
  numberDisplay.textContent = '?';
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  displayMessage('Start guessing...');
  document.querySelector('.guess').value = '';
}
