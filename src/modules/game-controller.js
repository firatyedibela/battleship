import { Player, Computer } from './player';
import Placement from './phases/placement';

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
