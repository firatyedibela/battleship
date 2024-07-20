import Ship from '../ship';
import dartSvg from '../../assets/dart.svg';
import dotSvg from '../../assets/dot.svg';
import EventHandlers from '../event-handlers';
import Placement from '../phases/placement';
import Utils from '../utils';

const Battle = (function () {
  let turn = 1;
  const playerOneBoardContainer = document.querySelector('.playerOneBoard');
  const playerTwoBoardContainer = document.querySelector('.playerTwoBoard');
  let playerOne;
  let playerTwo;

  const init = function (player, computer) {
    playerOne = player;
    playerTwo = computer;

    setActiveSection();
    renderScreen(player, computer);
  };

  function renderScreen(playerOne, playerTwo) {
    renderBoard(playerOne, playerOneBoardContainer);
    renderBoard(playerTwo, playerTwoBoardContainer, true);
    renderFleet(playerOne, 'one');
    renderFleet(playerTwo, 'two');
    renderTurn(turn);
  }

  function renderBoard(player, targetContainer, isComputer = false) {
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
            tCell.addEventListener('click', (e) =>
              EventHandlers.handleCellClick(e, player)
            );
          }

          if (boardCell === 'M') {
            tCell.innerHTML = `<img class="cell-symbol" src="${dotSvg}"></img>`;
            tCell.classList.add('missed-shot');
            tCell.classList.remove('empty');
          } else if (boardCell === 'H') {
            tCell.innerHTML = `<img class="cell-symbol" src="${dartSvg}"></img>`;
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

  function setActiveSection() {
    document.querySelector('.game-section.placement').className =
      'game-section placement';
    document.querySelector('.game-section.game-on').className =
      'game-section game-on active';
    document.querySelector('.game-section.game-over').className =
      'game-section game-over';
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
        while (true) {
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
  }

  function changeTurn() {
    turn = turn === 0 ? 1 : 0;
    playerTwoBoardContainer.classList.toggle('deactive');
  }

  return { init, playRound };
})();

export default Battle;
