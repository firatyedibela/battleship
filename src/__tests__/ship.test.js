import Ship from '../modules/ship';

describe('ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  it('should have a length equal to the provided value', () => {
    expect(ship.length).toBe(3);
  });

  describe('timesHit method', () => {
    it('should increase timesHit property by 1', () => {
      ship.hit();
      expect(ship.timesHit).toBe(1);
    });
  });

  describe('isSunken method', () => {
    it('should return true if timesHit is equal to ship length', () => {
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunken()).toBe(true);
    });

    it('should return false if timesHit is less than ship length', () => {
      ship.hit();
      ship.hit();
      expect(ship.isSunken()).toBe(false);
    });
  });
});
