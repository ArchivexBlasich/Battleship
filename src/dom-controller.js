import { events } from "./game-controller.js";


const boardController = (playerName) => {
  const BOARD_SIZE = 10;

  // cache DOM
  // crate a board container and append it to main
  let mainContainer = document.querySelector("main");
  let playerBoard = document.createElement("div");
  playerBoard.id = playerName;
  mainContainer.appendChild(playerBoard);

  // drag a drop variables
  let fleet = document.querySelector("#fleet");
  let draggedShipId = null;
  let validPosition;
  let shipsPosition = [];

  // bind events

  // functions
  function createBoard(board) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const button = document.createElement("button");
        button.dataset.row = i;
        button.dataset.column = j;

        board.appendChild(button);
      }
    }
  }

  function dragAndDropBoard() {
    for (const shipElement of fleet.children) {
      shipElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("ship-id", shipElement.id);
        draggedShipId = shipElement.id;
      });
      shipElement.addEventListener("dragend", (e) => {
        draggedShipId = null;
      });
    }

    for (const cell of playerBoard.children) {
      cell.addEventListener("dragenter", _handleDragEnter);
      cell.addEventListener("dragover", (e) => e.preventDefault());
      cell.addEventListener("drop", _handleDrop);
    }
  }

  function populateGameBoard(arr) {
    for (const ship of arr) {
      let [row, column] = ship.initialCoordinates;
      _renderShip(row, column, ship.length);
    }
  }

  function enableBoard() {
    playerBoard.addEventListener("click", _hitHandler);
  }

  function disableBoard() {
    playerBoard.removeEventListener("click", _hitHandler);
  }

  function attack(pos) {
    let [row, column] = pos;
    const btn = document.querySelector(
      `#${playerBoard.id} button[data-row="${row}"][data-column="${column}"]`,
    );

    btn.click();

    return btn.classList.contains("ship") ? true : false;
  }

  function _hitHandler(e) {
    let row = e.target.dataset.row;
    let column = e.target.dataset.column;
    const btn = document.querySelector(
      `#${playerBoard.id} button[data-row="${row}"][data-column="${column}"]`,
    );
    if (btn && !btn.classList.contains("hit")) {
      btn.textContent = "x";
      btn.classList.add("hit");
      events.emit("cellHit", [row, column]);
    }
  }

  function _handleDragEnter(e) {
    const shipId = draggedShipId;
    const shipLength = Number(document.getElementById(shipId).dataset.length);

    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.column);

    // clean old preview
    document
      .querySelectorAll(
        `#${playerBoard.id} .preview, #${playerBoard.id}  .invalid`,
      )
      .forEach((btn) => btn.classList.remove("preview", "invalid"));

    validPosition = col + shipLength <= BOARD_SIZE;

    for (let i = 0; i < shipLength; i++) {
      const btn = document.querySelector(
        `#${playerBoard.id} button[data-row="${row}"][data-column="${col + i}"]`,
      );
      if (!btn) continue;

      if (validPosition && !btn.classList.contains("ship")) {
        btn.classList.add("preview");
      } else {
        btn.classList.add("invalid");
        validPosition = false;
      }
    }
  }

  function _handleDrop(e) {
    e.preventDefault();
    const shipId = draggedShipId;
    if (!shipId) return;
    const ship = Array.from(fleet.children).find((s) => s.id === shipId);

    if (validPosition) {
      const row = Number(e.target.dataset.row);
      const col = Number(e.target.dataset.column);

      shipsPosition.push({
        initialCoordinates: [row, col],
        length: Number(document.getElementById(shipId).dataset.length),
      });
      document
        .querySelectorAll(
          `#${playerBoard.id} .preview, #${playerBoard.id}  .invalid`,
        )
        .forEach((btn) => {
          btn.classList.remove("preview", "invalid");
          btn.classList.add("ship");
        });
      ship.removeEventListener("dragstart", (e) => {
        e.dataTransfer.setData("ship-id", shipElement.id);
        draggedShipId = shipElement.id;
      });
      ship.removeEventListener("dragend", (e) => {
        draggedShipId = null;
      });
      ship.remove();
    }

    if (fleet.children.length === 0) {
      for (const cell of playerBoard.children) {
        cell.removeEventListener("dragenter", _handleDragEnter);
        cell.removeEventListener("dragover", (e) => e.preventDefault());
        cell.removeEventListener("drop", _handleDrop);
      }
      fleet.remove();
      events.emit("dragAndDropBoardEnded", shipsPosition);
    }
  }

  function _renderShip(row, column, length) {
    for (let i = 0; i < length; i++) {
      const btn = document.querySelector(
        `#${playerBoard.id} button[data-row="${row}"][data-column="${column + i}"]`,
      );
      btn.classList.add("ship");
    }
  }

  // initiate board once domController is invoke
  createBoard(playerBoard);

  return {
    populateGameBoard,
    dragAndDropBoard,
    enableBoard,
    disableBoard,
    attack,
  };
};

const pageController = () => {

  function setWinner(winner) {
    let winnerContainer = document.createElement("div");
    winnerContainer.classList.add("winner");
    winnerContainer.textContent = `${winner} Wins`;

    document.body.appendChild(winnerContainer);
  }

  return {
    setWinner,
  }
};

export { boardController, pageController };
