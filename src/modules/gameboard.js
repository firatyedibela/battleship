import Ship from '../modules/ship';

class Gameboard {
  constructor(size) {
    // Fleet array containing the ships that has been placed to the board
    this.fleet = [];

    // Create board as 2D array, This board keeps its references to ships
    this.boardForShips = Array(size)
      .fill()
      .map(() => Array(size).fill(0));

    // This board is just for ScreenController to look for when rendering boards,
    // Unlike boardForShips, this board will also contain miss shots and successfull shots
    // Its references to ships will be overwritten with 'H' symbol when a ship gets hit
    // Whenever we add a new ship, we copy from boardForShips
    this.boardForMoves = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
  }

  checkIfFleetDestroyed() {
    return this.fleet.every((ship) => ship.isSunken());
  }

  placeShip(row, col, length, isHorizontal) {
    const axis = isHorizontal ? 'x' : 'y';
    const ship = new Ship(length, axis);

    if (length === 1) {
      this.checkIfCellAvailable(row, col);
      this.boardForShips[row][col] = ship;
    }
    // Length > 1
    else {
      this.checkAllCells(row, col, length, isHorizontal);
      for (let i = 0; i < length; i++) {
        const currentRow = isHorizontal ? row : row + i;
        const currentCol = isHorizontal ? col + i : col;
        this.boardForShips[currentRow][currentCol] = ship;
      }
    }

    this.markAdjacentCells();
    this.fleet.push(ship);
  }

  resetBoard() {
    while (this.fleet.length > 0) {
      this.fleet.shift();
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.boardForShips[i][j] = 0;
      }
    }
  }

  markAdjacentCells() {
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }, // right
      { row: -1, col: -1 }, // up-left
      { row: -1, col: 1 }, // up-right
      { row: 1, col: -1 }, // down-left
      { row: 1, col: 1 }, // down-right
    ];

    // Iterate through every cell on board, check all directions for every cell. If any of the cells adjacent cells contains a Ship, mark the cell as adjacent
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Check only the cells doesn't contain a ship
        if (!(this.boardForShips[i][j] instanceof Ship)) {
          for (let direction of directions) {
            const newRow = i + direction.row;
            const newCol = j + direction.col;

            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 9) {
              if (this.boardForShips[newRow][newCol] instanceof Ship) {
                this.boardForShips[i][j] = 'A';

                // If ship has sunken, reveal adjacent cells that's not revealed before
                if (
                  this.boardForShips[newRow][newCol].isSunken() &&
                  this.boardForMoves[i][j] !== 'M'
                ) {
                  this.boardForMoves[i][j] = 'AR';
                }
              }
            }
          }
        }
      }
    }
  }

  receiveAttack(row, col) {
    // Reach the target cell
    const target = this.boardForShips[row][col];

    // Shot at ship
    if (target instanceof Ship) {
      target.hit();
      this.boardForMoves[row][col] = 'H';
      this.revealDiagonalCells(row, col);
      this.markAdjacentCells();
      return true;
    }
    // Miss shot
    else if (target === 0 || target === 'A') {
      this.boardForMoves[row][col] = 'M';
      return false;
    }
    // Invalid target
    else {
      throw new Error('This place was already hit before!');
    }
  }

  revealDiagonalCells(row, col) {
    const diagonals = [
      { row: -1, col: -1 }, // up-left
      { row: -1, col: 1 }, // up-right
      { row: 1, col: -1 }, // down-left
      { row: 1, col: 1 }, // down-right
    ];

    for (let diagonal of diagonals) {
      const revealRow = row + diagonal.row;
      const revealCol = col + diagonal.col;

      if (
        revealRow >= 0 &&
        revealRow <= 9 &&
        revealCol >= 0 &&
        revealCol <= 9 &&
        this.boardForShips[revealRow][revealCol] === 'A' &&
        this.boardForMoves[revealRow][revealCol] !== 'M'
      ) {
        this.boardForMoves[revealRow][revealCol] = 'AR';
      }
    }
  }

  checkIfCellAvailable(row, col) {
    // Overflow case
    if (row > 9 || col > 9) {
      throw new Error('Out of bounds!');
    }
    // Overlap case
    else if (this.boardForShips[row][col] instanceof Ship) {
      throw new Error('There is already a ship here!');
    } else if (this.boardForShips[row][col] === 'A') {
      throw new Error('You can not place ships adjacently.');
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
