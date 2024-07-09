import { Player, Computer } from './player';
import Gameboard from './gameboard';
import Screen from './screen-controller';
import Utils from './utils';

class Game {
  static playerOne;
  static playerTwo;
  static turn;

  static initNewGame() {
    this.playerOne = new Player();
    this.playerTwo = new Computer();
    this.turn = 1;

    this.playerOne.gameBoard.placeShip(0, 9, 5, false);
    this.playerOne.gameBoard.placeShip(5, 3, 4, true);
    this.playerOne.gameBoard.placeShip(0, 0, 3, true);
    this.playerOne.gameBoard.placeShip(0, 5, 3, false);
    this.playerOne.gameBoard.placeShip(2, 0, 2, false);
    this.playerOne.gameBoard.placeShip(7, 8, 2, false);
    this.playerOne.gameBoard.placeShip(8, 6, 1, true);
    this.playerOne.gameBoard.placeShip(8, 4, 1, true);

    // this.playerOne.gameBoard.placeShip(8, 5, 1, true);
    // this.playerOne.gameBoard.placeShip(0, 3, 5, false);
    // this.playerOne.gameBoard.placeShip(2, 2, 5, false);
    // this.playerOne.gameBoard.placeShip(7, 0, 5, true);
    // this.playerOne.gameBoard.placeShip(1, 1, 5, false);
    // this.playerOne.gameBoard.placeShip(0, 6, 5, false);
    // this.playerOne.gameBoard.placeShip(0, 7, 5, false);
    // this.playerOne.gameBoard.placeShip(0, 8, 5, false);

    this.playerTwo.gameBoard.placeShip(0, 9, 5, false);
    this.playerTwo.gameBoard.placeShip(5, 3, 4, true);
    this.playerTwo.gameBoard.placeShip(0, 0, 3, true);
    this.playerTwo.gameBoard.placeShip(0, 5, 3, false);
    this.playerTwo.gameBoard.placeShip(2, 0, 2, false);
    this.playerTwo.gameBoard.placeShip(7, 8, 2, false);
    this.playerTwo.gameBoard.placeShip(8, 6, 1, true);
    this.playerTwo.gameBoard.placeShip(8, 4, 1, true);

    console.log(this.playerOne.gameBoard.fleet);
    console.log(this.playerTwo.gameBoard.fleet);

    this.playerTwo.gameBoard.receiveAttack(6, 6);
    this.playerTwo.gameBoard.receiveAttack(8, 6);
    this.playerTwo.gameBoard.receiveAttack(5, 3);
    this.playerTwo.gameBoard.receiveAttack(5, 4);
    this.playerTwo.gameBoard.receiveAttack(5, 5);
    this.playerTwo.gameBoard.receiveAttack(5, 6);
    this.playerTwo.gameBoard.receiveAttack(5, 7);
    this.playerTwo.gameBoard.receiveAttack(0, 0);

    console.table(this.playerOne.gameBoard.boardForShips);
    console.table(this.playerTwo.gameBoard.boardForShips);

    Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);
  }

  static async playRound(row, col) {
    try {
      // (PLAYER) If active player makes a successfull shot, they will continue to play
      if (this.playerTwo.gameBoard.receiveAttack(row, col)) {
        Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);
      } else {
        this.changeTurn();
        Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);

        // (COMPUTER) If active player makes a successfull shot, they will continue to play
        while (true) {
          // Wait a bit and make the computer play
          await Utils.delay(750);

          // Computer must know if it made a successful shot so he can follow it up, that's why we're passing player's ships board to computer's makeMove function
          const playerShipsBoard = this.playerOne.boardForShips;
          const [pcRow, pcCol] = this.playerTwo.makeMove(playerShipsBoard);
          if (this.playerOne.gameBoard.receiveAttack(pcRow, pcCol)) {
            Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);

            // If the successfull shot didn't sink the ship and the followUpMode is inactive, Activate followUpMode, meaning the computer will hit the adjacent cells until it sinks the ship, on the contrary; deactivate followup mode
            if (
              this.playerOne.boardForShips[pcRow][pcCol].isSunken() === false &&
              this.playerTwo.followUpMode === false
            ) {
              this.playerTwo.activateFollowUpMode(pcRow, pcCol);
            } else if (
              this.playerOne.boardForShips[pcRow][pcCol].isSunken() === true &&
              this.playerTwo.followUpMode === true
            ) {
              this.playerTwo.deactivateFollowUpMode();
            }
            // Continue shooting because last shot was hit
            continue;
          } else {
            this.changeTurn();
            Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static changeTurn() {
    this.turn = this.turn === 0 ? 1 : 0;
    Screen.playerTwoBoardHTML.classList.toggle('deactive');
  }
}

export default Game;
