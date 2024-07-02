import Gameboard from '../modules/gameboard';
import Ship from '../modules/ship';

describe('gameboard', () => {
  // Reset board after each test block
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard(10);
  });

  // This function will call placeship for the given coordinates and then check if the board contains ships in the given coordinates
  const placeAndTestShip = function (row, col, length, isHorizontal) {
    // Place the ship
    gameboard.placeShip(row, col, length, isHorizontal);

    // Check if the corresponding positions contains ships
    for (let i = 0; i < length; i++) {
      const currentRow = isHorizontal ? row : row + i;
      const currentCol = isHorizontal ? col + i : col;
      const actual = gameboard.boardForMoves[currentRow][currentCol];
      expect(actual).toBeInstanceOf(Ship);
    }
  };

  describe('board', () => {
    it('exists', () => {
      expect(gameboard.boardForMoves).toBeDefined();
    });

    it('has Size x Size cells', () => {
      // Test 10x10
      let length =
        gameboard.boardForMoves.length * gameboard.boardForMoves[0].length;
      expect(length).toBe(100);

      // Test 15x15
      gameboard = new Gameboard(15);
      length =
        gameboard.boardForMoves.length * gameboard.boardForMoves[0].length;
      expect(length).toBe(225);
    });
  });

  describe('placeShip', () => {
    it('populates fleet array', () => {
      // Place 4 ships to the board
      gameboard.placeShip(2, 3, 3, true);
      gameboard.placeShip(3, 3, 2, false);
      gameboard.placeShip(0, 0, 2, true);
      gameboard.placeShip(1, 0, 4, false);

      expect(gameboard.fleet.length).toBe(4);
    });

    it('places a ship with length 1 properly', () => {
      placeAndTestShip(1, 2, 1, true);
      placeAndTestShip(6, 8, 1, true);
    });

    it('places a ship along horizontal axis properly', () => {
      placeAndTestShip(0, 0, 3, true);
      placeAndTestShip(2, 2, 5, true);
    });

    it('places a ship along vertical axis properly', () => {
      placeAndTestShip(2, 2, 3, false);
      placeAndTestShip(0, 0, 5, false);
    });

    it('should prevent ships with length 1 from overlapping', () => {
      // board[4][4] is not empty
      gameboard.boardForMoves = [
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
      gameboard.boardForMoves = [
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
      gameboard.boardForMoves = [
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
      gameboard.receiveAttack(3, 5);
      expect(gameboard.boardForMoves[3][5]).toEqual('M');
    });

    it('records the coordinates of an accurate shot', () => {
      gameboard.placeShip(0, 0, 2, true);
      gameboard.receiveAttack(0, 1);
      expect(gameboard.boardForMoves[0][1]).toBe('H');
    });

    it('throws an error if the cell was hit before', () => {
      gameboard.receiveAttack(6, 7);
      // Attempt to hit the same cell again
      expect(() => gameboard.receiveAttack(6, 7)).toThrow(
        'This place was already hit before!'
      );
    });

    it('sends hit to the correct ship', () => {
      // Place 2 different ships on the board
      gameboard.placeShip(0, 0, 3, true);
      gameboard.placeShip(2, 2, 4, false);

      // Hit first ship and check its hit count
      gameboard.receiveAttack(0, 1);
      expect(gameboard.fleet[0].timesHit).toBe(1);

      // Hit first ship again and check its hit count
      gameboard.receiveAttack(0, 0);
      expect(gameboard.fleet[0].timesHit).toBe(2);

      // Second ship did not get hit
      expect(gameboard.fleet[1].timesHit).toBe(0);
    });

    it('removes ship from the fleet if the ship has been sunk', () => {
      // Place 2 different ships on the board
      gameboard.placeShip(0, 0, 3, true);
      gameboard.placeShip(2, 2, 4, false);

      const firstShip = gameboard.boardForMoves[0][0];

      // Sink the firts ship
      for (let i = 0; i < 3; i++) {
        gameboard.receiveAttack(0, 0 + i);
      }

      expect(gameboard.fleet).not.toContain(firstShip);
    });
  });
});
