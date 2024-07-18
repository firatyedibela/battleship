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
    this.boardForMoves = [];
  }

  placeShip(row, col, length, isHorizontal) {
    const ship = new Ship(length);

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
    console.log(this.fleet);
    this.boardForMoves = this.boardForShips.map((row) => [...row]);
    console.table(this.boardForShips);
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

    console.log('RESETTED');
    console.log(this.boardForShips);
    console.log(this.fleet);
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
        // Check only the cell itself doesn't contain a ship
        if (!(this.boardForShips[i][j] instanceof Ship)) {
          for (let direction of directions) {
            const newRow = i + direction.row;
            const newCol = j + direction.col;

            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 9) {
              if (this.boardForShips[newRow][newCol] instanceof Ship) {
                this.boardForShips[i][j] = 'A';
                break;
              }
            }
          }
        }
      }
    }
  }

  receiveAttack(row, col) {
    console.log('HITTING ' + row + ' x ' + col);
    // Reach the target cell
    const target = this.boardForMoves[row][col];

    // Shot at ship
    if (target instanceof Ship) {
      target.hit();
      this.boardForMoves[row][col] = 'H';
      return true;

      // // Remove the ship if it's sunken
      // if (target.isSunken()) {
      //   this.removeShipFromFleet(target);
      // }
    }
    // Miss shot
    else if (target === 0) {
      this.boardForMoves[row][col] = 'M';
      return false;
    }
    // Invalid target
    else {
      throw new Error('This place was already hit before!');
    }
  }

  // removeShipFromFleet(ship) {
  //   const index = this.fleet.indexOf(ship);
  //   this.fleet.splice(index, 1);
  // }

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
