import { Ship } from '../main.js';

test('should have a length equal to the provided value', () => {
  let ship = new Ship(3);
  expect(ship.length).toBe(3);
});
