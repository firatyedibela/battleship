import Gameboard from '../modules/gameboard';
import Player from '../modules/player';

describe('player', () => {
  const player1 = new Player();

  it('contains its own gameboard', () => {
    expect(player1.gameBoard).toBeInstanceOf(Gameboard);
  });
  0;
});
