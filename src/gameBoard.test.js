import { describe, expect, it } from "@jest/globals";
import { Ship } from "./ship.js";
import { GameBoard } from "./gameBoard.js";

describe("Game Board factory tests", () => {
  let gameBoard;
  let ship;

  beforeEach(() => {
    gameBoard = GameBoard();
    ship = Ship(4);
  });

  describe("placeShip() tests", () => {
    it("throw error if receive coordinates out of range [0, 10]", () => {
      expect(() => gameBoard.placeShip(ship, [3, 6])).not.toThrow();
      expect(() => gameBoard.placeShip(ship, [0])).toThrow(
        "Coordinates must be in the form [x, y]",
      );
      expect(() => gameBoard.placeShip(ship, [-1, 6])).toThrow(
        "Row must be between 0 and 10",
      );
      expect(() => gameBoard.placeShip(ship, [7, 13])).toThrow(
        "Column must be between 0 and 10",
      );
      expect(() => gameBoard.placeShip(ship, [0, 5])).not.toThrow();
    });

    it("control placement does not exceed board size", () => {
      // ship has length = 4, so 7 + 4 = 11 > 10 (board size), so must throw a error
      expect(() => gameBoard.placeShip(ship, [3, 7])).toThrow(
        "Ship length exceed board size",
      );

      // horizontal = false -> vertical
      // ship has length = 4, so 8 + 4 = 12 > 10 (board size), so must throw a error
      expect(() => gameBoard.placeShip(ship, [8, 4], false)).toThrow(
        "Ship length exceed board size",
      );
    });

    it("try to place two ship in the same place throw an error", () => {
      expect(() => gameBoard.placeShip(ship, [3, 5])).not.toThrow();
      expect(() => gameBoard.placeShip(ship, [3, 5])).toThrow(
        "Already exist a ship in that position",
      );
      expect(() => gameBoard.placeShip(ship, [4, 5])).not.toThrow();
      expect(() => gameBoard.placeShip(ship, [3, 6], false)).toThrow(
        "Already exist a ship in that position",
      );
      expect(() => gameBoard.placeShip(ship, [3, 2], false)).not.toThrow();
    });
  });

  describe("receiveAttack() tests", () => {
    it("throw error if receive coordinates out of range [0, 10]", () => {
      expect(() => gameBoard.receiveAttack([3, 5])).not.toThrow();
      expect(() => gameBoard.receiveAttack([0])).toThrow(
        "Coordinates must be in the form [x, y]",
      );
      expect(() => gameBoard.receiveAttack([-1, 6])).toThrow(
        "Row must be between 0 and 10",
      );
      expect(() => gameBoard.receiveAttack([7, 13])).toThrow(
        "Column must be between 0 and 10",
      );
    });

    it("Increments ship number of hits", () => {
      gameBoard.placeShip(ship, [3, 5]);
      gameBoard.receiveAttack([3, 6]);
      expect(ship.getNumberOfHits()).toBe(1);
      gameBoard.receiveAttack([3, 7]);
      expect(ship.getNumberOfHits()).toBe(2);
    });

    it("records the coordinates of missed shot", () => {
      gameBoard.placeShip(ship, [3, 5]);
      let missShotCoordinates = [4, 6];
      gameBoard.receiveAttack(missShotCoordinates);
      let missShot = gameBoard.getMissedShots().pop();
      expect(missShot).toEqual(missShotCoordinates);
    });

    describe("report whether or not all of their ships have been sunk", () => {
      it("One ship", () => {
        // ship of length = 4, so occupies [3, 5], [3, 6], [3, 7], [3, 8]
        gameBoard.placeShip(ship, [3, 5]);
        gameBoard.receiveAttack([3, 5]);
        gameBoard.receiveAttack([3, 6]);
        gameBoard.receiveAttack([3, 7]);
        gameBoard.receiveAttack([3, 8]);
        expect(gameBoard.allShipsSunk()).toBe(true);
      });

      it("two ship", () => {
        let ship1 = Ship(4)
        // ship of length = 4, so occupies [3, 5], [3, 6], [3, 7], [3, 8]
        gameBoard.placeShip(ship1, [3, 5]);

        let ship2 = Ship(2);
        // ship of length = 2, so occupies [9, 8], [9,9]
        gameBoard.placeShip(ship2, [9, 8]);

        gameBoard.receiveAttack([3, 5]);
        gameBoard.receiveAttack([3, 6]);
        gameBoard.receiveAttack([3, 7]);
        gameBoard.receiveAttack([3, 8]);
        expect(gameBoard.allShipsSunk()).toBe(false);

        gameBoard.receiveAttack([9, 8]);
        gameBoard.receiveAttack([9, 9]);
        expect(gameBoard.allShipsSunk()).toBe(true);
      });
    });
  });
});
