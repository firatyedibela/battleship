import './styles/main.css';
import Gameboard from './modules/gameboard';
import GameController from './modules/game-controller';

const game = new GameController();
game.startNewGame();

export default game;
