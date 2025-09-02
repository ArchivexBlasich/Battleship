import { describe, expect, it } from "@jest/globals";
import { Ship } from "./ship.js";

describe("ship factory tests", () => {
  let ship;

  beforeEach(() => {
    ship = Ship(4);
  });

  it("throw error when create a ship with length that is not in the range [1, 5]", () => {
    expect(() => Ship(6)).toThrow();
    expect(() => Ship(-1)).toThrow();
    expect(() => Ship(3)).not.toThrow();
  });

  it("increments the number of hit() each time its call", () => {
    beforeHit = ship.getNumberOfHits();
    ship.hit();
    afterHit = ship.getNumberOfHits();
    expect(afterHit).toBe(beforeHit + 1);
  });

  it("hit() number of hits not be grater than ship length", () => {
    let length = ship.getLength();

    for (let index = 0; index <= length; index++) {
      beforeHit = ship.getNumberOfHits();
      ship.hit();
      afterHit = ship.getNumberOfHits();
      if (index !== length) {
        expect(afterHit).toBe(beforeHit + 1);
      } else {
        expect(afterHit).toBe(beforeHit);
      }
    }
  });

  it("ship is sunk based when its length equal the number of hits", () => {
    let length = ship.getLength();

    for (let index = 0; index < length; index++) {
      expect(ship.isSunk()).toBe(false);
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true); // length === numberOfHits
  });
});