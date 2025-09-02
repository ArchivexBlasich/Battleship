const GameBoard = () => {
  const boardSize = 10;
  const board = Array(10);
  const missedShots = [];

  const _init = () => {
    for (let i = 0; i < boardSize; i++) {
      board[i] = Array(10);
      for (let j = 0; j < boardSize; j++) {
        board[i][j] = Cell();
      }
    }
  };

  const placeShip = (ship, initialCoordinates, horizontal = true) => {
    _checkCoordinates(initialCoordinates);

    let [row, column] = initialCoordinates;

    if (horizontal) {
      if (column + ship.getLength() > boardSize)
        throw Error("Ship length exceed board size");

      for (let i = 0; i < ship.getLength(); i++) {
        let cell = board[row][column + i];
        if (cell.hasShip())
          throw Error("Already exist a ship in that position");
      }

      for (let i = 0; i < ship.getLength(); i++) {
        let cell = board[row][column + i];
        cell.setShip(ship);
      }
    } else {
      if (row + ship.getLength() > boardSize)
        throw Error("Ship length exceed board size");

      for (let i = 0; i < ship.getLength(); i++) {
        let cell = board[row + i][column];
        if (cell.hasShip())
          throw Error("Already exist a ship in that position");
      }

      for (let i = 0; i < ship.getLength(); i++) {
        let cell = board[row + i][column];
        cell.setShip(ship);
      }
    }
  };

  const receiveAttack = (coordinates) => {
    _checkCoordinates(coordinates);

    let [row, column] = coordinates;
    let cell = board[row][column];
    if (cell.hasShip()) {
      cell.hitShip();
    } else {
      if (!_containsArray(missedShots, [row, column]))
        missedShots.push(coordinates);
    }
  };

  const allShipsSunk = () => {
    for (const row of board) {
      for (const cell of row) {
        if (cell.hasShip()) {
          if (!cell.isHit()) return false;
        }
      }
    }

    return true;
  };

  const getBoardSize = () => {
    return boardSize;
  };

  const getMissedShots = () => {
    return missedShots;
  };

  const _checkCoordinates = (coordinates) => {
    if (Array.isArray(coordinates) && coordinates.length !== 2)
      throw Error("Coordinates must be in the form [x, y]");

    let [row, column] = coordinates;
    if (row < 0 || row > boardSize - 1)
      throw Error("Row must be between 0 and 10");
    if (column < 0 || column > boardSize - 1)
      throw Error("Column must be between 0 and 10");
  };

  function _containsArray(parentArray, childArray) {
    const childArrayAsString = JSON.stringify(childArray);

    return parentArray.some(
      (item) => JSON.stringify(item) === childArrayAsString,
    );
  }

  _init();

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    getBoardSize,
    getMissedShots,
  };
};

const Cell = () => {
  let shipReference;
  let hit = false;

  const setShip = (ship) => {
    shipReference = ship;
  };

  const hasShip = () => {
    return shipReference !== undefined;
  };

  const hitShip = () => {
    if (!hit) {
      hit = true;
      shipReference.hit();
    }
  };

  const isHit = () => {
    return hit;
  };

  return {
    setShip,
    hasShip,
    hitShip,
    isHit,
  };
};

export { GameBoard };
