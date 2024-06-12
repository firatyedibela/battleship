import Ship from '../modules/ship';

class Gameboard {
  constructor(size) {
    // Create board as 2D array
    this.board = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
  }

  placeShip(row, col, length, isHorizontal) {
    const ship = new Ship(length);
    if (length === 1) {
      this.checkIfCellAvailable(row, col);
      this.board[row][col] = 'S';
    }
    // Length more than 1
    else {
      this.checkAllCells(row, col, length, isHorizontal);
      for (let i = 0; i < length; i++) {
        const currentRow = isHorizontal ? row : row + i;
        const currentCol = isHorizontal ? col + i : col;
        this.board[currentRow][currentCol] = 'S';
      }
    }
  }

  receiveAttack(row, col) {
    if (this.board[row][col] !== 0) {
      throw new Error('This place was already hit before!');
    }
    this.board[row][col] = 'M';
  }

  checkIfCellAvailable(row, col) {
    // Overflow case
    if (row > 9 || col > 9) {
      throw new Error('Out of bounds!');
    }
    // Overlap case
    else if (this.board[row][col] !== 0) {
      throw new Error('Cell already occupied!');
    }
  }

  checkAllCells(row, col, length, isHorizontal) {
    for (let i = 0; i < length; i++) {
      // The axis alongh which we're placing the ship remains constant
      // The other axis increases with each iteration
      const currentRow = isHorizontal ? row : row + i;
      const currentCol = isHorizontal ? col + i : col;
      this.checkIfCellAvailable(currentRow, currentCol);
    }
  }
}

export default Gameboard;
