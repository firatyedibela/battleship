import Ship from '../modules/ship';

class Gameboard {
  constructor(size) {
    // Fleet array containing the ships that has been placed to the board
    this.fleet = [];

    // Create board as 2D array

    // This board keeps its references to ships
    this.boardForShips = Array(size)
      .fill()
      .map(() => Array(size).fill(0));

    // This board is just for ScreenController to look for when rendering boards,
    // Unlike boardForShips, this board will also contain miss shots and successfull shots
    // Its references to ships will be overwritten with 'H' symbol when a ship gets hit
    // Whenever we add a new ship, we copy from boardForShips
    this.boardForMoves = this.boardForShips.map((row) => [...row]);
  }

  placeShip(row, col, length, isHorizontal) {
    const ship = new Ship(length);
    this.fleet.push(ship);

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
    this.boardForMoves = this.boardForShips.map((row) => [...row]);
  }

  receiveAttack(row, col) {
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
    else if (this.boardForMoves[row][col] !== 0) {
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
