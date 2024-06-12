import Gameboard from '../modules/gameboard';

describe('gameboard', () => {
  // Reset board after each test block
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard(10);
  });

  describe('board', () => {
    it('should have a board property', () => {
      expect(gameboard.board).toBeDefined();
    });

    it('should have Size x Size cells', () => {
      // Test 10x10
      let length = gameboard.board.length * gameboard.board[0].length;
      expect(length).toBe(100);

      // Test 15x15
      gameboard = new Gameboard(15);
      length = gameboard.board.length * gameboard.board[0].length;
      expect(length).toBe(225);
    });
  });

  describe('placeShip', () => {
    it('should place a ship with length 1 properly', () => {
      // Test
      let row = 1;
      let col = 2;
      let length = 1;
      gameboard.placeShip(row, col, length, true);
      let actual = gameboard.board;
      let expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);

      // Test
      row = 6;
      col = 8;
      length = 1;
      gameboard.placeShip(row, col, length, true);
      actual = gameboard.board;
      expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 'S', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);
    });

    it('should place a ship with a length more than 1 properly', () => {
      // Test with length 3
      let row = 0;
      let col = 0;
      let length = 3;
      gameboard.placeShip(row, col, length, true);
      let actual = gameboard.board;
      let expected = [
        ['S', 'S', 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);

      // Test with length 5 and different starting point
      row = 2;
      col = 2;
      length = 5;
      gameboard.placeShip(row, col, length, true);
      actual = gameboard.board;
      expected = [
        ['S', 'S', 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 'S', 'S', 'S', 'S', 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);
    });

    it('should place a ship through correct axis', () => {
      // Test vertical
      let row = 2;
      let col = 2;
      let length = 3;
      gameboard.placeShip(row, col, length, false);
      let actual = gameboard.board;
      let expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);

      // Test horizontal
      row = 2;
      col = 4;
      length = 3;
      gameboard.placeShip(row, col, length, true);
      actual = gameboard.board;
      expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 'S', 'S', 'S', 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 'S', 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(actual).toEqual(expected);
    });

    it('should prevent ships with length 1 from overlapping', () => {
      // board[4][4] is not empty
      gameboard.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 'S', 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(() => {
        gameboard.placeShip(4, 4, 1, true);
      }).toThrow('Cell already occupied!');
    });

    it('should prevent ships from horizontal overlapping', () => {
      // Horizontal overlapping, [5][5] is not empty
      gameboard.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 'S', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(() => {
        gameboard.placeShip(5, 3, 4, true);
      }).toThrow('Cell already occupied!');
    });

    it('should prevent ships from vertical overlapping', () => {
      // Vertical overlapping, [5][5] is not empty
      gameboard.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 'S', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(() => {
        gameboard.placeShip(3, 5, 4);
      }).toThrow('Cell already occupied!');
    });

    it('should prevent ships from horizontal overflowing', () => {
      expect(() => {
        gameboard.placeShip(0, 7, 4, true);
      }).toThrow('Out of bounds!');
    });

    it('should prevent ships from vertical overflowing', () => {
      // Vertical overflowing

      expect(() => {
        gameboard.placeShip(7, 0, 4, false);
      }).toThrow('Out of bounds!');
    });
  });

  describe('receiveAttack', () => {
    it('records the coordinates of a missed shot', () => {
      let row = 3;
      let col = 5;
      gameboard.receiveAttack(row, col);
      let expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 'M', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      expect(gameboard.board).toEqual(expected);
    });

    it('throws an error if the cell was hit before', () => {
      let row = 6;
      let col = 7;
      gameboard.receiveAttack(row, col);
      // Attempt to hit the same cell again
      expect(() => gameboard.receiveAttack(row, col)).toThrow(
        'This place was already hit before!'
      );
    });
  });
});
