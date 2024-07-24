import { Player, Computer } from './player';
import Gameboard from './gameboard';
import Screen from './screen-controller';
import Utils from './utils';
import Placement from './phases/placement';
import Battle from './phases/battle';

class GameController {
  constructor() {
    this.playerOne;
    this.playerTwo;
  }

  startNewGame() {
    this.playerOne = new Player();
    this.playerTwo = new Computer();
    this.playerTwo.makeRandomPlacement();

    Placement.init(this.playerOne, this.playerTwo);
  }
}

export default GameController;
