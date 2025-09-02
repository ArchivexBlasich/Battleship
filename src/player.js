import { GameBoard } from "./gameBoard.js";

const Player = () => {
  let gameBoard = GameBoard();

  return {
    gameBoard,
  };
};

export { Player };
