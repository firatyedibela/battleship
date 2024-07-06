import Ship from './ship';
import dartSvg from '../assets/dart.svg';
import dotSvg from '../assets/dot.svg';
import EventHandlers from './event-handlers';

class Screen {
  static playerOneBoardHTML = document.querySelector('.playerOneBoard');
  static playerTwoBoardHTML = document.querySelector('.playerTwoBoard');

  static updateScreen(playerOne, playerTwo, turn) {
    // Clear first to avoid duplication
    this.playerOneBoardHTML.innerHTML = '';
    this.playerTwoBoardHTML.innerHTML = '';

    this.renderBoard(playerOne, this.playerOneBoardHTML);
    this.renderFleet(playerOne, 'one');
    this.renderBoard(playerTwo, this.playerTwoBoardHTML, true);
    this.renderFleet(playerTwo, 'two');
    this.renderTurn(turn);
  }

  static renderLastHit() {}

  static renderTurn(turn) {
    const p = document.querySelector('.turn');
    p.textContent = turn === 1 ? 'Your turn!' : "Computer's turn!";
  }

  static renderBoard(player, targetContainer, isComputer = false) {
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

  static renderFleet(player, playerId) {
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
}

export default Screen;
