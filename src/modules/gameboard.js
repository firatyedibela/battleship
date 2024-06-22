import Ship from '../modules/ship';

class Gameboard {
  constructor(size) {
    // Fleet array containing the ships that has been placed to the board
    this.fleet = [];

    // Create board as 2D array
    this.board = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
  }

  placeShip(row, col, length, isHorizontal) {
    const ship = new Ship(length);
    this.fleet.push(ship);

    if (length === 1) {
      this.checkIfCellAvailable(row, col);
      this.board[row][col] = ship;
    }
    // Length > 1
    else {
      this.checkAllCells(row, col, length, isHorizontal);
      for (let i = 0; i < length; i++) {
        const currentRow = isHorizontal ? row : row + i;
        const currentCol = isHorizontal ? col + i : col;
        this.board[currentRow][currentCol] = ship;
      }
    }
  }

  removeShipFromFleet(ship) {
    const index = this.fleet.indexOf(ship);
    this.fleet.splice(index, 1);
  }

  receiveAttack(row, col) {
    // Reach the target cell
    const target = this.board[row][col];

    // Shot at ship
    if (target instanceof Ship) {
      target.hit();
      this.board[row][col] = 'H';

      // If the ship has sunk, call removeShipFromFleet
      if (target.isSunk()) {
        this.removeShipFromFleet(target);
      }
    }
    // Miss shot
    else if (target === 0) {
      this.board[row][col] = 'M';
    }
    // Invalid target
    else {
      throw new Error('This place was already hit before!');
    }
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
