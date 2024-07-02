import Ship from './ship';

class Screen {
  static playerOneBoardHTML = document.querySelector('.playerOneBoard');
  static playerTwoBoardHTML = document.querySelector('.playerTwoBoard');

  static updateScreen(boardOne, boardTwo, turn) {
    this.renderBoard(boardOne, this.playerOneBoardHTML);
    this.renderBoard(boardTwo, this.playerTwoBoardHTML);
    this.renderTurn(turn);
  }

  static renderLastHit() {}

  static renderTurn(turn) {
    const p = document.querySelector('.turn');
    p.textContent = turn === 1 ? 'Your turn!' : "Computer's turn!";
  }

  static renderBoard(referenceBoard, targetContainer) {
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
          const tCell = document.createElement('td');
          tCell.classList.add = 'shipCell';
          tCell.dataset['posX'] = j - 1;
          tCell.dataset['posY'] = i - 1;

          if (referenceBoard[i - 1][j - 1] instanceof Ship) {
            tCell.textContent = 'S';
          } else {
            tCell.textContent = referenceBoard[i - 1][j - 1];
          }

          tRow.appendChild(tCell);
        }
      }

      targetContainer.appendChild(tRow);
    }
  }
}

export default Screen;
