import Utils from '../utils';
import GameOver from './game-over';
import Ship from '../ship';
import dotSvg from '../../assets/dot.svg';
import ferrySvg from '../../assets/ferry.svg';

const Battle = (function () {
  let turn;
  let playerOne;
  let playerTwo;

  const init = function (player, computer) {
    playerOne = player;
    playerTwo = computer;
    turn = 1;

    renderScreen();
  };

  function renderScreen() {
    renderStructure();
    renderBoard(playerOne);
    renderBoard(playerTwo, true);
    renderFleet(playerOne, 'one');
    renderFleet(playerTwo, 'two');
    renderTurn(turn);

    checkForWinner();
  }
  function renderStructure() {
    document.querySelector('main').innerHTML = `
      <section class="game-section battle">
        <section class="player-one-section">
          <div class="fleet-container">
            <div class="fleet-header">Your Fleet</div>
            <div class="fleet"></div>
          </div>
          <table class="player-one-board board">
            <caption>
              Your Board
            </caption>
          </table>
        </section>
        <section class="player-two-section">
          <table class="player-two-board board">
            <caption>
              Opponent's Board
            </caption>
          </table>
          <div class="fleet-container">
            <div class="fleet-header">Computer's Fleet</div>
            <div class="fleet"></div>
          </div>
          <p class="turn"></p>
        </section>
     </section>
    `;
  }

  function renderBoard(player, isComputer = false) {
    const playerOneBoardContainer = document.querySelector('.player-one-board');
    const playerTwoBoardContainer = document.querySelector('.player-two-board');
    if (turn === 0) {
      playerTwoBoardContainer.classList.add('deactive');
    }
    const targetContainer = isComputer
      ? playerTwoBoardContainer
      : playerOneBoardContainer;

    targetContainer.innerHTML = '';

    const movesBoard = player.boardForMoves;
    const referenceBoard = player.boardForShips;

    for (let i = 0; i < 11; i++) {
      const tRow = document.createElement('tr');

      for (let j = 0; j < 11; j++) {
        // First row and column will only contain coordinates
        if (i === 0 && j === 0) {
          const tHead = document.createElement('th');
          tRow.appendChild(tHead);
        }
        // First row will contain letters
        else if (i === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = String.fromCharCode(65 + j - 1);
          tRow.appendChild(tHead);
        }
        // First column will contain numbers
        else if (j === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = `${i}`;
          tRow.appendChild(tHead);
        }
        // The rest will contain board information (ship, miss shot etc.)
        else {
          const boardCell = movesBoard[i - 1][j - 1];

          const tCell = document.createElement('td');

          tCell.classList.add('ship-cell');
          tCell.classList.add('empty');
          tCell.dataset['posX'] = j - 1;
          tCell.dataset['posY'] = i - 1;

          if (isComputer) {
            tCell.classList.add('opponent');
            if (boardCell === 0) {
              tCell.addEventListener('click', handleCellClick);
            }
          }

          if (!isComputer && referenceBoard[i - 1][j - 1] instanceof Ship) {
            tCell.classList.add('player-ship');
          }

          if (boardCell === 'M') {
            tCell.innerHTML = `<img class="cell-symbol" src="${dotSvg}"></img>`;
            tCell.classList.add('missed-shot');
            tCell.classList.remove('empty');
          } else if (boardCell === 'AR') {
            tCell.innerHTML = `<img class="cell-symbol" src="${dotSvg}"></img>`;
            tCell.classList.add('revealed-shot');
            tCell.classList.remove('empty');
          } else if (boardCell === 'H') {
            tCell.innerHTML = `<img class="cell-symbol" src="${ferrySvg}"></img>`;
            tCell.classList.add('hit');
            tCell.classList.remove('empty');

            // Checking if the cell is part of a sunken ship
            if (referenceBoard[i - 1][j - 1].isSunken()) {
              tCell.classList.add('sunken');
            }
          }

          tRow.appendChild(tCell);
        }
      }

      targetContainer.appendChild(tRow);
    }
  }

  function renderFleet(player, playerId) {
    const fleet = player.gameBoard.fleet;

    // Reset fleet to avoid duplication
    document.querySelector(`.player-${playerId}-section .fleet`).innerHTML = '';

    fleet.forEach((ship) => {
      const shipContainer = document.createElement('div');
      shipContainer.className = 'fleet-ship-container';

      for (let i = 0; i < ship.length; i++) {
        const shipPart = document.createElement('div');
        shipPart.className = ship.isSunken()
          ? 'ship-part part-sunken'
          : 'ship-part';
        shipContainer.appendChild(shipPart);
      }

      document
        .querySelector(`.player-${playerId}-section .fleet`)
        .appendChild(shipContainer);
    });
  }

  function renderTurn(turn) {
    const p = document.querySelector('.turn');
    p.textContent = turn === 1 ? 'Your turn!' : "Computer's turn!";
  }

  async function playRound(row, col) {
    try {
      // (PLAYER) If active player makes a successfull shot, they will continue to play
      if (playerTwo.gameBoard.receiveAttack(row, col)) {
        renderScreen(playerOne, playerTwo);
      } else {
        changeTurn();
        renderScreen(playerOne, playerTwo);

        // (COMPUTER) If active player makes a successfull shot, they will continue to play
        while (!playerOne.gameBoard.checkIfFleetDestroyed()) {
          // Wait a bit and make the computer play
          await Utils.delay(750);

          // Computer must know if it made a successful shot so he can follow it up, that's why we're passing player's ships board to computer's makeMove function
          const playerShipsBoard = playerOne.boardForShips;
          const [pcRow, pcCol] = playerTwo.makeMove(playerShipsBoard);
          if (playerOne.gameBoard.receiveAttack(pcRow, pcCol)) {
            renderScreen(playerOne, playerTwo);

            // If the successfull shot didn't sink the ship and the followUpMode is inactive, Activate followUpMode, meaning the computer will hit the adjacent cells until it sinks the ship, on the contrary; deactivate followup mode
            if (
              !playerOne.boardForShips[pcRow][pcCol].isSunken() &&
              !playerTwo.followUpMode
            ) {
              playerTwo.activateFollowUpMode(pcRow, pcCol);
            } else if (
              playerOne.boardForShips[pcRow][pcCol].isSunken() &&
              playerTwo.followUpMode
            ) {
              playerTwo.deactivateFollowUpMode();
            }
            // Continue shooting because last shot was hit
            continue;
          } else {
            changeTurn();
            renderScreen(playerOne, playerTwo);
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    console.log(playerTwo.gameBoard.fleet);
    console.log(playerTwo.gameBoard.fleet);
    console.table(playerTwo.boardForShips);
    console.table(playerTwo.boardForMoves);
  }

  function changeTurn() {
    turn = turn === 0 ? 1 : 0;
  }

  function checkForWinner() {
    if (playerOne.gameBoard.checkIfFleetDestroyed()) {
      GameOver.init(0);
    } else if (playerTwo.gameBoard.checkIfFleetDestroyed()) {
      GameOver.init(1);
    }
  }

  function handleCellClick(e) {
    let cell;
    // When a cell is clicked, it renders an image inside it.
    // After that, a click's target is going to be the image.
    // However, posX and posY datas were defined on the cell container element.
    // So we need to get the data from parent element after img is rendered
    if (e.target.tagName === 'IMG') {
      cell = e.target.parentElement;
    } else {
      cell = e.target;
    }

    const row = Number(cell.dataset.posY);
    const col = Number(cell.dataset.posX);

    Battle.playRound(row, col);
  }

  return { init, playRound };
})();

export default Battle;
