import { Ship } from "./ship.js";
import { Player } from "./player.js";
import { boardController, pageController } from "./dom-controller.js";

const gameController = () => {
  const human = Player();
  const computer = Player();
  const humanBoardDOM = boardController("human-player");
  const computerBoardDOM = boardController("computer-player");

  const page = pageController();

  // variables use to control user turn
  const PLAYER1 = "human";
  const PLAYER2 = "computer";
  let currentPlayer;

  // variables use to computer logic attack
  let allComputerMoves = [];
  let hits_list = [];
  let adjacent_cells = [];
  const HUNTER_MODE = "hunt";
  const TARGET_MODE = "target";
  let currentMode;

  //bind events
  events.on("cellHit", _hitHandler);

  humanBoardDOM.dragAndDropBoard();
  events.on("dragAndDropBoardEnded", init);

  // functions
  function init(shipsPositions) {
    for (const ship of shipsPositions) {
      human.gameBoard.placeShip(Ship(ship.length), ship.initialCoordinates);
    }
    _setShipsInRandomPlacements(computer.gameBoard, computerBoardDOM);

    _setComputerMoves();

    currentPlayer = PLAYER1;
    computerBoardDOM.enableBoard();

    currentMode = HUNTER_MODE;
  }

  function _hitHandler(arr) {
    let [row, column] = arr;
    if (currentPlayer === PLAYER1) {
      computer.gameBoard.receiveAttack([row, column]);
      _toggleTurn();
      _computerAttack();
      if (computer.gameBoard.allShipsSunk()) _gameWinner();
    } else {
      human.gameBoard.receiveAttack([row, column]);
      _toggleTurn();
      if (human.gameBoard.allShipsSunk()) _gameWinner();
    }
  }

  function _computerAttack() {
    if (currentPlayer === PLAYER1) return;

    if (currentMode === HUNTER_MODE) {
      let position = allComputerMoves.pop();
      let hit = humanBoardDOM.attack(position);
      if (hit) {
        hits_list.push(position);
        getAdjacent(position);
        if (adjacent_cells.length !== 0) currentMode = TARGET_MODE;
      }
    } else {
      let nextTarget = adjacent_cells.pop();
      _removeArrayInPlace(allComputerMoves, nextTarget);
      let hit = humanBoardDOM.attack(nextTarget);
      if (hit) {
        hits_list.push(nextTarget);
        getAdjacent(nextTarget);
      }
      if (adjacent_cells.length === 0) currentMode = HUNTER_MODE;
    }
  }

  function _toggleTurn() {
    if (currentPlayer === PLAYER1) {
      computerBoardDOM.disableBoard();
      humanBoardDOM.enableBoard();
      currentPlayer = PLAYER2;
      return;
    }

    humanBoardDOM.disableBoard();
    computerBoardDOM.enableBoard();
    currentPlayer = PLAYER1;
  }

  function _gameWinner() {
    if (computer.gameBoard.allShipsSunk()) {
      page.setWinner(PLAYER1);
    } else {
      page.setWinner(PLAYER2);
    }

    humanBoardDOM.disableBoard();
    computerBoardDOM.disableBoard();
  }

  function _setComputerMoves() {
    // generate movements
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        allComputerMoves.push([row, col]);
      }
    }

    // shuffle all movements
    _shuffleArr(allComputerMoves);
  }

  function getAdjacent(position) {
    let incrementArr = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    _shuffleArr(incrementArr);
    for (const increment of incrementArr) {
      let [row, column] = position;
      let [adjRow, adjColumn] = [row + increment[0], column + increment[1]];
      if (!(adjRow < 0 || adjRow > 9 || adjColumn < 0 || adjColumn > 9)) {
        if (
          _containsArray(allComputerMoves, [adjRow, adjColumn]) &&
          !_containsArray(adjacent_cells, [adjRow, adjColumn])
        )
          adjacent_cells.push([adjRow, adjColumn]);
      }
    }
  }

  function _shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function _containsArray(parentArray, childArray) {
    const childArrayAsString = JSON.stringify(childArray);

    return parentArray.some(
      (item) => JSON.stringify(item) === childArrayAsString,
    );
  }

  function _removeArrayInPlace(parentArray, arrayToRemove) {
    const arrayToRemoveAsString = JSON.stringify(arrayToRemove);

    const index = parentArray.findIndex(
      (item) => JSON.stringify(item) === arrayToRemoveAsString,
    );

    if (index !== -1) {
      parentArray.splice(index, 1);
    }
  }

  return {
    events,
  };
};

function _setShipsInRandomPlacements(gameBoard, domBoardController) {
  while (true) {
    try {
      let initialPositions = _getRandomPlacements();
      let ships = [];
      for (const [i, val] of initialPositions.entries()) {
        let shipLength = i + 1;
        if (shipLength === 2) shipLength = 3;
        if (shipLength === 1) shipLength = 2;
        gameBoard.placeShip(Ship(shipLength), val);
        ships.push({ initialCoordinates: val, length: shipLength });
      }
      domBoardController.populateGameBoard(ships);
      // If the try block completes successfully, we break the loop
      break;
    } catch (error) {
      // If an error occurred (e.g., ship goes off-board), we do nothing.
      // The loop will simply continue to the next iteration,
      // and a new set of random placements will be generated.
      console.error("Ship placement failed, retrying...", error);
    }
  }

  function _getRandomPlacements() {
    const NUMBER_OF_SHIPS = 5;
    let positions = [];
    newPosition: for (let i = 0; i < NUMBER_OF_SHIPS; ) {
      let position = [
        Math.round(Math.random() * 9),
        Math.round(Math.random() * 5),
      ];
      for (const pos of positions) {
        let [row, _] = position;
        if (row === pos[0]) continue newPosition;
      }

      positions.push(position);
      i++;
    }

    return positions;
  }
}

let events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function (eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  },
};

export { gameController, events };
