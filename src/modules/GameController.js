import Player from './player';
import Gameboard from './gameboard';
import Screen from './ScreenController';

class Game {
  static playerOne;
  static playerTwo;
  static turn;

  static initNewGame() {
    this.playerOne = new Player();
    this.playerTwo = new Player();
    this.turn = 1;

    this.playerOne.gameBoard.placeShip(0, 9, 5, false);
    this.playerOne.gameBoard.placeShip(5, 3, 4, true);
    this.playerOne.gameBoard.placeShip(0, 0, 3, true);
    this.playerOne.gameBoard.placeShip(2, 0, 2, false);
    this.playerOne.gameBoard.placeShip(8, 6, 1, true);

    this.playerTwo.gameBoard.placeShip(0, 9, 5, false);
    this.playerTwo.gameBoard.placeShip(5, 3, 4, true);
    this.playerTwo.gameBoard.placeShip(0, 0, 3, true);
    this.playerTwo.gameBoard.placeShip(2, 0, 2, false);
    this.playerTwo.gameBoard.placeShip(8, 6, 1, true);

    Screen.updateScreen(this.playerOne.board, this.playerTwo.board, this.turn);
  }

  static playRound() {
    console.log("Welcome to the Game. Here's the boards");
    console.table(this.playerOne.board);
    console.table(this.playerTwo.board);
  }
}

export default Game;
