import Gameboard from './gameboard';

class Player {
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

export default Player;
