import Gameboard from './gameboard';

class Player {
  constructor() {
    this.gameBoard = new Gameboard(10);
  }

  get board() {
    return this.gameBoard.board;
  }
}

export default Player;
