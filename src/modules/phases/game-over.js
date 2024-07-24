import GameController from '../game-controller';
import game from '../../main';

const GameOver = (function () {
  function init(winner) {
    setActiveSection();
    renderScreen(winner);
    addEventListeners();
  }

  function renderScreen(winner) {
    console.log(winner);
    document.querySelector('header').style.backgroundColor = winner
      ? 'rgb(4, 209, 4)'
      : 'red';

    document.querySelector('.game-over-msg').textContent = winner
      ? 'Victory! Congratulations admiral'
      : 'Defeat! Try again';
  }

  function addEventListeners() {
    document
      .querySelector('.play-again-btn')
      .addEventListener('click', game.startNewGame);
  }

  function setActiveSection() {
    document.querySelector('.game-section.placement').className =
      'game-section placement';
    document.querySelector('.game-section.battle').className =
      'game-section battle active blurred';
    document.querySelector('.game-section.game-over').className =
      'game-section game-over active';
  }

  return { init };
})();

export default GameOver;
