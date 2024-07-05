import { Player, Computer } from './player';
import Gameboard from './gameboard';
import Screen from './screen-controller';

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

  static playRound(row, col) {
    try {
      this.playerTwo.gameBoard.receiveAttack(row, col);
      this.changeTurn();

      Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);

      // Wait a bit and make the computer play
      setTimeout(() => {
        this.playerOne.gameBoard.receiveAttack(...this.playerTwo.makeMove());
        this.changeTurn();
        Screen.updateScreen(this.playerOne, this.playerTwo, this.turn);
      }, 2000);
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
