import Gameboard from './gameboard';
import Utils from './utils';

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
  }

  // Computer keeps track of its former moves to avoid making a move more than once
  static movesBoard = Array(10)
    .fill(null)
    .map((row) => Array(10).fill(null));

  makeMove() {
    let row;
    let col;

    while (true) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);

      // Compares current move to former moves, if current move has been made before, it tries again until it finds the unique move
      if (Computer.movesBoard[row][col]) {
        continue;
      } else {
        Computer.movesBoard[row][col] = true;
        return [row, col];
      }
    }
  }
}
