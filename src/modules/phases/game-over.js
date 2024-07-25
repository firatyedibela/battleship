import game from '../../main';
import Battle from './battle';

const GameOver = (function () {
  function init(winner) {
    renderScreen(winner);
  }

  function renderScreen(winner) {
    renderStructure();

    console.log(winner);
    if (winner) {
      document.querySelector('header').classList.add('winner');
    } else {
      document.querySelector('header').classList.add('loser');
    }

    // document.querySelector('header').style.backgroundColor = winner
    //   ? 'rgb(4, 209, 4)'
    //   : 'red';

    document.querySelector('.game-over-msg').textContent = winner
      ? 'Victory! Congratulations admiral'
      : 'Defeat! Try again';
  }

  function renderStructure() {
    document.querySelector('.game-section.battle').classList.add('blurred');

    document.querySelector('main').innerHTML += `
      <section class="game-section game-over">
        <h2 class="game-over-msg"></h2>
        <button class="play-again-btn">Play Again</button>
      </section>
    `;
    document
      .querySelector('.play-again-btn')
      .addEventListener('click', game.startNewGame);
  }

  return { init };
})();

export default GameOver;
