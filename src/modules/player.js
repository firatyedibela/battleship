import Gameboard from './gameboard';
import Utils from './utils';
import Ship from './ship';

export class Player {
  constructor() {
    this.gameBoard = new Gameboard(10);
  }

  get boardForShips() {
    return this.gameBoard.boardForShips;
  }

  get boardForMoves() {
    return this.gameBoard.boardForMoves;
  }
}

export class Computer extends Player {
  constructor() {
    super();

    // Computer keeps track of its moves to avoid making the same move more than once
    this.movesBoard = Array(10)
      .fill(null)
      .map((row) => Array(10).fill(null));

    this.lastMove = { x: null, y: null };

    this.followUpMode = false;
    this.followUpDirection = null;
    this.checkedFollowUpDirections = [];
    this.followUpStartingPoint = { row: null, col: null };
  }

  makeRandomPlacement() {
    const placementFleet = [
      {
        name: 'Carrier',
        length: 4,
        placed: false,
      },
    ];

    /* WHILE placementFleet.length > 0
      1- Choose two random numbers for coordinates (0,9)
      2- Choose a random number for horizontal/vertical
      3- Create target cells array containing coordinate objects 
      4- Based on ship length and axis, populate targetCells array
      5- Iterate through target cells array and check if corresponding coordinates available
        If not available
          Return to 1st step
        Else if available
          Call placeship
          Remove current ship from placementFleet
    */

    while (placementFleet.length > 0) {
      const location = Utils.generateRandomCoordinates();
      const axis = Utils.generateRandomAxis();
      const targetCells = [];
      let placementValid = true;

      for (let i = 0; i < placementFleet[0].length; i++) {
        if (axis === 'horizontal') {
          targetCells.push({ ...location, col: location.col + i });
        } else {
          targetCells.push({ ...location, row: location.row + i });
        }
      }

      targetCells.forEach((coordinates) => {
        const { row, col } = coordinates;
        if (row > 9 || col > 9 || this.boardForShips[row][col] !== 0) {
          placementValid = false;
          return;
        }
      });

      if (placementValid) {
        this.gameBoard.placeShip(
          location.row,
          location.col,
          placementFleet[0].length,
          axis === 'horizontal'
        );
        placementFleet.shift();
      }
    }
  }

  makeMove(playerShipsBoard) {
    if (this.followUpMode) {
      const [row, col] = this.makeFollowUpMove(playerShipsBoard);
      this.movesBoard[row][col] = true;
      return [row, col];
    } else {
      return this.makeRandomMove();
    }
  }

  makeRandomMove() {
    let row;
    let col;

    while (true) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);

      // Compares current move to former moves, if current move has been made before, it tries again until it finds the unique move
      if (this.movesBoard[row][col]) {
        continue;
      } else {
        this.movesBoard[row][col] = true;
        this.setLastMove(row, col);
        return [row, col];
      }
    }
  }

  setLastMove(row, col) {
    this.lastMove.x = col;
    this.lastMove.y = row;
  }

  makeFollowUpMove(playerShipsBoard) {
    const lastRow = this.lastMove.y;
    const lastCol = this.lastMove.x;

    let row = lastRow;
    let col = lastCol;

    // If a direction was set before, computer will keep shooting on that direction
    if (this.followUpDirection) {
      switch (this.followUpDirection) {
        case 'top':
          row = lastRow - 1;
          // If the next cell of that direction is not shootable, computer should turn to the starting point and keep shooting on the opposite direction (top > bottom, left > right)
          if (!this.checkIfCellShootable(row, col)) {
            this.followUpDirection = 'bottom';
            row = this.followUpStartingPoint.row + 1;
            col = this.followUpStartingPoint.col;
          }
          // If there is no ship on the next cell of that direciton, computer must change direction
          // For that, besides changing the direction, we must set the last move to followUpStartingPoint so it goes back to where it started and start shooting the opposite direction from there,
          if (!(playerShipsBoard[row][col] instanceof Ship)) {
            this.followUpDirection = 'bottom';
            this.setLastMove(
              this.followUpStartingPoint.row,
              this.followUpStartingPoint.col
            );
            return [row, col];
          }
          break;
        case 'right':
          col = lastCol + 1;
          if (!this.checkIfCellShootable(row, col)) {
            this.followUpDirection = 'left';
            row = this.followUpStartingPoint.row;
            col = this.followUpStartingPoint.col - 1;
          }
          if (!(playerShipsBoard[row][col] instanceof Ship)) {
            this.followUpDirection = 'left';
            this.setLastMove(
              this.followUpStartingPoint.row,
              this.followUpStartingPoint.col
            );
            return [row, col];
          }
          break;
        case 'bottom':
          row = lastRow + 1;
          if (!this.checkIfCellShootable(row, col)) {
            this.followUpDirection = 'top';
            row = this.followUpStartingPoint.row - 1;
            col = this.followUpStartingPoint;
          }
          if (!(playerShipsBoard[row][col] instanceof Ship)) {
            this.followUpDirection = 'top';
            this.setLastMove(
              this.followUpStartingPoint.row,
              this.followUpStartingPoint.col
            );
            return [row, col];
          }
          break;
        case 'left':
          col = lastCol - 1;
          if (!this.checkIfCellShootable(row, col)) {
            this.followUpDirection = 'right';
            row = this.followUpStartingPoint.row;
            col = this.followUpStartingPoint.col + 1;
          }
          if (!(playerShipsBoard[row][col] instanceof Ship)) {
            this.followUpDirection = 'right';
            this.setLastMove(
              this.followUpStartingPoint.row,
              this.followUpStartingPoint.col
            );
            return [row, col];
          }
          break;
      }
      this.setLastMove(row, col);
      return [row, col];
    }
    // If no direction was set before, computer will try directions one by one until it finds the rest of the ship and sets the direction
    else {
      row = this.followUpStartingPoint.row;
      col = this.followUpStartingPoint.col;
      if (!this.checkedFollowUpDirections.includes('top')) {
        this.checkedFollowUpDirections.push('top');
        // If shootable, return the coordinates
        if (
          this.checkIfCellShootable(
            this.followUpStartingPoint.row - 1,
            this.followUpStartingPoint.col
          )
        ) {
          row = this.followUpStartingPoint.row - 1;
          // Also if there is a ship, set the followUpDirection
          if (playerShipsBoard[row][col] instanceof Ship) {
            this.followUpDirection = 'top';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('right')) {
        this.checkedFollowUpDirections.push('right');
        if (
          this.checkIfCellShootable(
            this.followUpStartingPoint.row,
            this.followUpStartingPoint.col + 1
          )
        ) {
          col = this.followUpStartingPoint.col + 1;
          if (playerShipsBoard[row][col] instanceof Ship) {
            this.followUpDirection = 'right';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('bottom')) {
        this.checkedFollowUpDirections.push('bottom');
        if (
          this.checkIfCellShootable(
            this.followUpStartingPoint.row + 1,
            this.followUpStartingPoint.col
          )
        ) {
          row = this.followUpStartingPoint.row + 1;
          if (playerShipsBoard[row][col] instanceof Ship) {
            this.followUpDirection = 'bottom';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('left')) {
        this.checkedFollowUpDirections.push('left');
        if (
          this.checkIfCellShootable(
            this.followUpStartingPoint.row,
            this.followUpStartingPoint.col - 1
          )
        ) {
          col = this.followUpStartingPoint.col - 1;
          if (playerShipsBoard[row][col] instanceof Ship) {
            console.log('SETTING DIRECTION LEFT');
            this.followUpDirection = 'left';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
    }
  }

  activateFollowUpMode(row, col) {
    this.followUpMode = true;
    this.followUpStartingPoint.row = row;
    this.followUpStartingPoint.col = col;
  }

  deactivateFollowUpMode() {
    this.followUpMode = false;
    this.followUpStartingPoint.x = null;
    this.followUpStartingPoint.y = null;

    this.followUpDirection = null;
    this.checkedFollowUpDirections.length = 0;
  }

  checkIfCellShootable(row, col) {
    if (row > 9 || col > 9 || row < 0 || col < 0) {
      return false;
    } else if (this.movesBoard[row][col] || this.movesBoard[row][col]) {
      return false;
    } else {
      return true;
    }
  }
}
