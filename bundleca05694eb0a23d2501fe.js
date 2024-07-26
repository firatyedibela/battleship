/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _styles_main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/main.css */ "./src/styles/main.css");
/* harmony import */ var _modules_gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _modules_game_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/game-controller */ "./src/modules/game-controller.js");



const game = new _modules_game_controller__WEBPACK_IMPORTED_MODULE_2__["default"]();
game.startNewGame();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);

/***/ }),

/***/ "./src/modules/game-controller.js":
/*!****************************************!*\
  !*** ./src/modules/game-controller.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");
/* harmony import */ var _phases_placement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./phases/placement */ "./src/modules/phases/placement.js");


class GameController {
  constructor() {
    this.playerOne;
    this.playerTwo;
  }
  startNewGame() {
    this.playerOne = new _player__WEBPACK_IMPORTED_MODULE_0__.Player();
    this.playerTwo = new _player__WEBPACK_IMPORTED_MODULE_0__.Computer();
    this.playerTwo.makeRandomPlacement();
    _phases_placement__WEBPACK_IMPORTED_MODULE_1__["default"].init(this.playerOne, this.playerTwo);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameController);

/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/ship */ "./src/modules/ship.js");

class Gameboard {
  constructor(size) {
    // Fleet array containing the ships that has been placed to the board
    this.fleet = [];

    // Create board as 2D array, This board keeps its references to ships
    this.boardForShips = Array(size).fill().map(() => Array(size).fill(0));

    // This board is just for ScreenController to look for when rendering boards,
    // Unlike boardForShips, this board will also contain miss shots and successfull shots
    // Its references to ships will be overwritten with 'H' symbol when a ship gets hit
    // Whenever we add a new ship, we copy from boardForShips
    this.boardForMoves = Array(size).fill().map(() => Array(size).fill(0));
    this.lastMissedShot = {};
  }
  checkIfFleetDestroyed() {
    return this.fleet.every(ship => ship.isSunken());
  }
  placeShip(row, col, length, isHorizontal) {
    const axis = isHorizontal ? 'x' : 'y';
    const ship = new _modules_ship__WEBPACK_IMPORTED_MODULE_0__["default"](length, axis);
    if (length === 1) {
      this.checkIfCellAvailable(row, col);
      this.boardForShips[row][col] = ship;
    }
    // Length > 1
    else {
      this.checkAllCells(row, col, length, isHorizontal);
      for (let i = 0; i < length; i++) {
        const currentRow = isHorizontal ? row : row + i;
        const currentCol = isHorizontal ? col + i : col;
        this.boardForShips[currentRow][currentCol] = ship;
      }
    }
    this.markAdjacentCells();
    this.fleet.push(ship);
  }
  resetBoard() {
    while (this.fleet.length > 0) {
      this.fleet.shift();
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.boardForShips[i][j] = 0;
      }
    }
  }
  markAdjacentCells() {
    const directions = [{
      row: -1,
      col: 0
    },
    // up
    {
      row: 1,
      col: 0
    },
    // down
    {
      row: 0,
      col: -1
    },
    // left
    {
      row: 0,
      col: 1
    },
    // right
    {
      row: -1,
      col: -1
    },
    // up-left
    {
      row: -1,
      col: 1
    },
    // up-right
    {
      row: 1,
      col: -1
    },
    // down-left
    {
      row: 1,
      col: 1
    } // down-right
    ];

    // Iterate through every cell on board, check all directions for every cell. If any of the cells adjacent cells contains a Ship, mark the cell as adjacent
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Check only the cells doesn't contain a ship
        if (!(this.boardForShips[i][j] instanceof _modules_ship__WEBPACK_IMPORTED_MODULE_0__["default"])) {
          for (let direction of directions) {
            const newRow = i + direction.row;
            const newCol = j + direction.col;
            if (newRow >= 0 && newRow <= 9 && newCol >= 0 && newCol <= 9) {
              if (this.boardForShips[newRow][newCol] instanceof _modules_ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
                this.boardForShips[i][j] = 'A';

                // If ship has sunken, reveal adjacent cells that's not revealed before
                if (this.boardForShips[newRow][newCol].isSunken() && this.boardForMoves[i][j] !== 'M') {
                  this.boardForMoves[i][j] = 'M';
                }
              }
            }
          }
        }
      }
    }
  }
  revealDiagonalCells(row, col) {
    const diagonals = [{
      row: -1,
      col: -1
    },
    // up-left
    {
      row: -1,
      col: 1
    },
    // up-right
    {
      row: 1,
      col: -1
    },
    // down-left
    {
      row: 1,
      col: 1
    } // down-right
    ];
    for (let diagonal of diagonals) {
      const revealRow = row + diagonal.row;
      const revealCol = col + diagonal.col;
      if (revealRow >= 0 && revealRow <= 9 && revealCol >= 0 && revealCol <= 9 && this.boardForShips[revealRow][revealCol] === 'A' && this.boardForMoves[revealRow][revealCol] !== 'M') {
        this.boardForMoves[revealRow][revealCol] = 'M';
        // Save it to computer's movesBoard in order to prevent random move generator to select these cells
        if (this.movesBoard) {
          this.movesBoard[revealRow][revealCol] = true;
        }
      }
    }
  }
  receiveAttack(row, col) {
    // Reach the target cell
    const target = this.boardForShips[row][col];

    // Shot at ship
    if (target instanceof _modules_ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      target.hit();
      this.boardForMoves[row][col] = 'H';
      this.revealDiagonalCells(row, col);
      this.markAdjacentCells();
      return true;
    }
    // Miss shot
    else if (target === 0 || target === 'A') {
      this.boardForMoves[row][col] = 'M';
      this.lastMissedShot.row = row;
      this.lastMissedShot.col = col;
      return false;
    }
    // Invalid target
    else {
      throw new Error('This place was already hit before!');
    }
  }
  checkIfCellAvailable(row, col) {
    // Overflow case
    if (row > 9 || col > 9) {
      throw new Error('Out of bounds!');
    }
    // Overlap case
    else if (this.boardForShips[row][col] instanceof _modules_ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      throw new Error('There is already a ship here!');
    } else if (this.boardForShips[row][col] === 'A') {
      throw new Error('You can not place ships adjacently.');
    }
  }
  checkAllCells(row, col, length, isHorizontal) {
    for (let i = 0; i < length; i++) {
      // The axis alongh which we're placing the ship remains constant
      // The other axis increases with each iteration
      const currentRow = isHorizontal ? row : row + i;
      const currentCol = isHorizontal ? col + i : col;
      this.checkIfCellAvailable(currentRow, currentCol);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/modules/phases/battle.js":
/*!**************************************!*\
  !*** ./src/modules/phases/battle.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/modules/utils.js");
/* harmony import */ var _game_over__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game-over */ "./src/modules/phases/game-over.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ship */ "./src/modules/ship.js");
/* harmony import */ var _assets_dot_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/dot.svg */ "./src/assets/dot.svg");
/* harmony import */ var _assets_ferry_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/ferry.svg */ "./src/assets/ferry.svg");





const Battle = function () {
  let turn;
  let playerOne;
  let playerTwo;
  const init = function (player, computer) {
    playerOne = player;
    playerTwo = computer;
    turn = 1;
    renderScreen();
  };
  function renderScreen() {
    renderStructure();
    renderBoard(playerOne);
    renderBoard(playerTwo, true);
    renderFleet(playerOne, 'one');
    renderFleet(playerTwo, 'two');
    renderTurn(turn);
    checkForWinner();
  }
  function renderStructure() {
    document.querySelector('main').innerHTML = `
      <section class="game-section battle">
        <section class="player-one-section">
          <div class="fleet-container">
            <div class="fleet-header">Your Fleet</div>
            <div class="fleet"></div>
          </div>
          <table class="player-one-board board">
            <caption>
              Your Board
            </caption>
          </table>
        </section>
        <section class="player-two-section">
          <table class="player-two-board board">
            <caption>
              Opponent's Board
            </caption>
          </table>
          <div class="fleet-container">
            <div class="fleet-header">Computer's Fleet</div>
            <div class="fleet"></div>
          </div>
          <p class="turn"></p>
        </section>
     </section>
    `;
  }
  function renderBoard(player) {
    let isComputer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const playerOneBoardContainer = document.querySelector('.player-one-board');
    const playerTwoBoardContainer = document.querySelector('.player-two-board');
    if (turn === 0) {
      playerTwoBoardContainer.classList.add('deactive');
    }
    const targetContainer = isComputer ? playerTwoBoardContainer : playerOneBoardContainer;
    targetContainer.innerHTML = '';
    const lastMissedShotRow = player.gameBoard.lastMissedShot.row;
    const lastMissedShotCol = player.gameBoard.lastMissedShot.col;
    const movesBoard = player.boardForMoves;
    const referenceBoard = player.boardForShips;
    for (let i = 0; i < 11; i++) {
      const tRow = document.createElement('tr');
      for (let j = 0; j < 11; j++) {
        // First row and column will only contain coordinates
        if (i === 0 && j === 0) {
          const tHead = document.createElement('th');
          tRow.appendChild(tHead);
        }
        // First row will contain letters
        else if (i === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = String.fromCharCode(65 + j - 1);
          tRow.appendChild(tHead);
        }
        // First column will contain numbers
        else if (j === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = `${i}`;
          tRow.appendChild(tHead);
        }
        // The rest will contain board information (ship, miss shot etc.)
        else {
          const boardCell = movesBoard[i - 1][j - 1];
          const tCell = document.createElement('td');
          tCell.classList.add('ship-cell');
          tCell.classList.add('empty');
          tCell.dataset['posX'] = j - 1;
          tCell.dataset['posY'] = i - 1;
          if (isComputer) {
            tCell.classList.add('opponent');
            if (boardCell === 0) {
              tCell.addEventListener('click', handleCellClick);
              tCell.classList.add('clickable');
            }
          }
          if (!isComputer && referenceBoard[i - 1][j - 1] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            tCell.classList.add('player-ship');
          }
          if (boardCell === 'M') {
            tCell.innerHTML = `<img class="cell-symbol" src="${_assets_dot_svg__WEBPACK_IMPORTED_MODULE_3__}"></img>`;
            tCell.classList.add('missed-shot');
            tCell.classList.remove('empty');
            if (lastMissedShotRow === i - 1 && lastMissedShotCol === j - 1) {
              tCell.classList.remove('missed-shot');
              tCell.classList.add('last-missed-shot');
            }
          } else if (boardCell === 'H') {
            tCell.innerHTML = `<img class="cell-symbol" src="${_assets_ferry_svg__WEBPACK_IMPORTED_MODULE_4__}"></img>`;
            tCell.classList.add('hit');
            tCell.classList.remove('empty');

            // Checking if the cell is part of a sunken ship
            if (referenceBoard[i - 1][j - 1].isSunken()) {
              tCell.classList.add('sunken');
            }
          }
          tRow.appendChild(tCell);
        }
      }
      targetContainer.appendChild(tRow);
    }
  }
  function renderFleet(player, playerId) {
    const fleet = player.gameBoard.fleet;

    // Reset fleet to avoid duplication
    document.querySelector(`.player-${playerId}-section .fleet`).innerHTML = '';
    fleet.forEach(ship => {
      const shipContainer = document.createElement('div');
      shipContainer.className = 'fleet-ship-container';
      for (let i = 0; i < ship.length; i++) {
        const shipPart = document.createElement('div');
        shipPart.className = ship.isSunken() ? 'ship-part part-sunken' : 'ship-part';
        shipContainer.appendChild(shipPart);
      }
      document.querySelector(`.player-${playerId}-section .fleet`).appendChild(shipContainer);
    });
  }
  function renderTurn(turn) {
    const p = document.querySelector('.turn');
    p.textContent = turn === 1 ? 'Your turn!' : "Computer's turn!";
  }
  async function playRound(row, col) {
    try {
      // (PLAYER) If active player makes a successfull shot, they will continue to play
      if (playerTwo.gameBoard.receiveAttack(row, col)) {
        renderScreen(playerOne, playerTwo);
      } else {
        changeTurn();
        renderScreen(playerOne, playerTwo);

        // (COMPUTER) If active player makes a successfull shot, they will continue to play
        while (!playerOne.gameBoard.checkIfFleetDestroyed()) {
          // Wait a bit and make the computer play
          await _utils__WEBPACK_IMPORTED_MODULE_0__["default"].delay(650);

          // Computer must know if it made a successful shot so he can follow it up, that's why we're passing player's ships board to computer's makeMove function
          const playerShipsBoard = playerOne.boardForShips;
          const playerMovesBoard = playerOne.boardForMoves;
          const [pcRow, pcCol] = playerTwo.makeMove(playerShipsBoard, playerMovesBoard);
          if (playerOne.gameBoard.receiveAttack(pcRow, pcCol)) {
            renderScreen(playerOne, playerTwo);

            // If the successfull shot didn't sink the ship and the followUpMode is inactive, Activate followUpMode, meaning the computer will hit the adjacent cells until it sinks the ship, on the contrary; deactivate followup mode
            if (!playerOne.boardForShips[pcRow][pcCol].isSunken() && !playerTwo.followUpMode) {
              playerTwo.activateFollowUpMode(pcRow, pcCol);
            } else if (playerOne.boardForShips[pcRow][pcCol].isSunken() && playerTwo.followUpMode) {
              playerTwo.deactivateFollowUpMode();
            }
            // Continue shooting because last shot was hit
            continue;
          } else {
            changeTurn();
            renderScreen(playerOne, playerTwo);
            break;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    console.log("PLAYER'S BOARD FOR MOVEs");
    console.table(playerOne.boardForMoves);
  }
  function changeTurn() {
    turn = turn === 0 ? 1 : 0;
  }
  function checkForWinner() {
    if (playerOne.gameBoard.checkIfFleetDestroyed()) {
      _game_over__WEBPACK_IMPORTED_MODULE_1__["default"].init(0);
    } else if (playerTwo.gameBoard.checkIfFleetDestroyed()) {
      _game_over__WEBPACK_IMPORTED_MODULE_1__["default"].init(1);
    }
  }
  function handleCellClick(e) {
    let cell;
    // When a cell is clicked, it renders an image inside it.
    // After that, a click's target is going to be the image.
    // However, posX and posY datas were defined on the cell container element.
    // So we need to get the data from parent element after img is rendered
    if (e.target.tagName === 'IMG') {
      cell = e.target.parentElement;
    } else {
      cell = e.target;
    }
    const row = Number(cell.dataset.posY);
    const col = Number(cell.dataset.posX);
    Battle.playRound(row, col);
  }
  return {
    init,
    playRound
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Battle);

/***/ }),

/***/ "./src/modules/phases/game-over.js":
/*!*****************************************!*\
  !*** ./src/modules/phases/game-over.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../main */ "./src/main.js");
/* harmony import */ var _battle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./battle */ "./src/modules/phases/battle.js");


const GameOver = function () {
  function init(winner) {
    renderScreen(winner);
  }
  function renderScreen(winner) {
    renderStructure();
    console.log(winner);
    if (winner) {
      document.querySelector('header').classList.add('winner');
    } else {
      document.querySelector('header').classList.add('loser');
    }

    // document.querySelector('header').style.backgroundColor = winner
    //   ? 'rgb(4, 209, 4)'
    //   : 'red';

    document.querySelector('.game-over-msg').textContent = winner ? 'Victory! Congratulations admiral' : 'Defeat! Try again';
  }
  function renderStructure() {
    document.querySelector('.game-section.battle').classList.add('blurred');
    document.querySelector('main').innerHTML += `
      <section class="game-section game-over">
        <h2 class="game-over-msg"></h2>
        <button class="play-again-btn">Play Again</button>
      </section>
    `;
    document.querySelector('.play-again-btn').addEventListener('click', _main__WEBPACK_IMPORTED_MODULE_0__["default"].startNewGame);
  }
  return {
    init
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameOver);

/***/ }),

/***/ "./src/modules/phases/placement.js":
/*!*****************************************!*\
  !*** ./src/modules/phases/placement.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ship */ "./src/modules/ship.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/modules/utils.js");
/* harmony import */ var _battle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./battle */ "./src/modules/phases/battle.js");



const Placement = function () {
  let placementFleet;
  let axis = 'horizontal';
  let playerOne;
  let playerTwo;
  const init = function (player, computer) {
    placementFleet = [{
      name: 'Carrier',
      length: 4
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }];
    playerOne = player;
    playerTwo = computer;
    renderScreen();
  };
  const renderScreen = function () {
    renderStructure();
    renderPlacementFleet();
    renderPlacementBoard();
  };
  const renderStructure = function () {
    // Reset header bg color
    document.querySelector('header').classList.remove('winner');
    document.querySelector('header').classList.remove('loser');
    document.querySelector('main').innerHTML = `
      <section class="game-section placement active">
        <h2 class="placement-header">${placementFleet[0] ? 'Place your ' + placementFleet[0].name : 'You are ready for battle!'}</h2>
        <h2 class="placement-error-message"></h2>
        <div>
          <div class="placement-fleet">
            <div class="placement-line">
              <div class="placement-ship" data-length="4"></div>
            </div>
            <div class="placement-line">
              <div class="placement-ship" data-length="3"></div>
              <div class="placement-ship" data-length="3"></div>
            </div>
            <div class="placement-line">
              <div class="placement-ship" data-length="2"></div>
              <div class="placement-ship" data-length="2"></div>
              <div class="placement-ship" data-length="2"></div>
            </div>
            <div class="placement-line">
              <div class="placement-ship" data-length="1"></div>
              <div class="placement-ship" data-length="1"></div>
              <div class="placement-ship" data-length="1"></div>
              <div class="placement-ship" data-length="1"></div>
            </div>
          </div>
          <div class="board-buttons">
            <button class="change-axis-btn">Change Axis</button>
            <button class="reset-placement-btn">Reset</button>
          </div>
          <button class="start-game-btn">Start Game</button>
      </div>
      <table class="placement-board"></table>
    </section>
    `;
    document.querySelector('.start-game-btn').addEventListener('click', () => {
      handleStartGame(playerOne, playerTwo);
    });
    document.querySelector('.change-axis-btn').addEventListener('click', () => {
      axis = axis === 'horizontal' ? 'vertical' : 'horizontal';
      console.log(axis);
    });
    document.querySelector('.reset-placement-btn').addEventListener('click', () => {
      resetPlacement();
    });
  };
  async function handleStartGame() {
    if (placementFleet.length === 0) {
      _battle__WEBPACK_IMPORTED_MODULE_2__["default"].init(playerOne, playerTwo);
    } else {
      const header = document.querySelector('.placement-header');
      header.classList.add('shake');
      await _utils__WEBPACK_IMPORTED_MODULE_1__["default"].delay(400);
      header.classList.remove('shake');
    }
  }
  const renderPlacementFleet = function () {
    const fleetContainer = document.querySelector('.placement-fleet');
    fleetContainer.innerHTML = '';
    // Create 4 lines
    let shipLength = 4;
    for (let i = 0; i < 4; i++) {
      const line = document.createElement('div');
      line.className = 'placement-line';
      const shipsForLine = placementFleet.filter(ship => ship.length === shipLength);
      shipsForLine.forEach(ship => {
        const shipHTML = `
          <div class="placement-ship" data-length="${ship.length}"></div>
        `;
        line.innerHTML += shipHTML;
      });
      fleetContainer.appendChild(line);
      shipLength -= 1;
    }
  };
  const handlePlaceShip = function (cell) {
    const row = Number(cell.dataset.posY);
    const col = Number(cell.dataset.posX);
    if (!placementFleet.length > 0) {
      throw new Error('No more ships left!');
    }
    try {
      playerOne.gameBoard.placeShip(row, col, placementFleet[0].length, axis === 'horizontal');
      placementFleet.shift();
      renderScreen();
    } catch (err) {
      handlePlacementError(err);
    }
  };
  const handleHoverCell = function (cell) {
    const startCell = {
      posX: Number(cell.dataset.posX),
      posY: Number(cell.dataset.posY)
    };
    const previewCells = getPreviewCells(startCell, placementFleet[0].length);
    let isPlacementValid = true;
    previewCells.forEach(cell => {
      if (!cell || cell.dataset.occupied || cell.dataset.adjacent) {
        isPlacementValid = false;
      }
    });
    if (isPlacementValid) {
      previewCells.forEach(cell => {
        cell.style.backgroundColor = 'blue';
      });
    } else {
      previewCells.forEach(cell => {
        if (cell) {
          cell.style.backgroundColor = 'red';
        }
      });
    }
  };
  const handleMouseLeaveCell = function (cell) {
    const startCell = {
      posX: Number(cell.dataset.posX),
      posY: Number(cell.dataset.posY)
    };
    const previewCells = getPreviewCells(startCell, placementFleet[0].length);
    previewCells.forEach(cell => {
      if (cell) {
        if (cell.dataset.occupied) {
          cell.style.backgroundColor = 'blue';
        } else if (cell.dataset.adjacent) {
          cell.style.backgroundColor = 'rgba(207, 180, 180, 0.781)';
        } else {
          cell.style.backgroundColor = 'rgba(81, 148, 255, 0.808)';
        }
      }
    });
  };
  const getPreviewCells = function (startCell, length) {
    const previewCellsArray = [];
    for (let i = 0; i < length; i++) {
      const posX = axis === 'horizontal' ? startCell.posX + i : startCell.posX;
      const posY = axis === 'horizontal' ? startCell.posY : startCell.posY + i;
      const cell = document.querySelector(`td[data-pos-x="${posX}"][data-pos-y="${posY}"]`);
      previewCellsArray.push(cell);
    }
    return previewCellsArray;
  };
  const renderPlacementBoard = function () {
    // Clear first
    document.querySelector('.placement-board').innerHTML = '';
    const shipsBoard = playerOne.gameBoard.boardForShips;
    for (let i = 0; i < 11; i++) {
      const tRow = document.createElement('tr');
      for (let j = 0; j < 11; j++) {
        // First row and column will only contain coordinates
        if (i === 0 && j === 0) {
          const tHead = document.createElement('th');
          tRow.appendChild(tHead);
        }
        // First row will contain letters
        else if (i === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = String.fromCharCode(65 + j - 1);
          tRow.appendChild(tHead);
        }
        // First column will contain numbers
        else if (j === 0) {
          const tHead = document.createElement('th');
          tHead.textContent = `${i}`;
          tRow.appendChild(tHead);
        } else {
          const row = i - 1;
          const col = j - 1;
          const tCell = document.createElement('td');
          tCell.dataset['posX'] = col;
          tCell.dataset['posY'] = row;
          if (shipsBoard[row][col] === 0) {
            tCell.addEventListener('mouseover', e => {
              if (placementFleet.length > 0) {
                handleHoverCell(e.target);
              }
            });
            tCell.addEventListener('mouseleave', e => {
              if (placementFleet.length > 0) {
                handleMouseLeaveCell(e.target);
              }
            });
          } else if (shipsBoard[row][col] === 'A') {
            tCell.dataset['adjacent'] = true;
          } else if (shipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
            tCell.dataset['occupied'] = true;
          }
          tCell.addEventListener('click', e => {
            try {
              handlePlaceShip(e.target, playerOne);
            } catch (err) {
              console.log(err);
            }
          });
          tRow.appendChild(tCell);
        }
      }
      document.querySelector('.placement-board').appendChild(tRow);
    }
  };
  const resetPlacement = function () {
    playerOne.gameBoard.resetBoard();
    placementFleet = [{
      name: 'Carrier',
      length: 4
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }];
    renderScreen();
  };
  const handlePlacementError = function (err) {
    const container = document.querySelector('.placement-error-message');
    container.textContent = err.message;
  };
  return {
    init
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Placement);

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Computer: () => (/* binding */ Computer),
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/modules/utils.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");



class Player {
  constructor() {
    this.gameBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"](10);
  }
  get boardForShips() {
    return this.gameBoard.boardForShips;
  }
  get boardForMoves() {
    return this.gameBoard.boardForMoves;
  }
}
class Computer extends Player {
  constructor() {
    super();

    // Computer keeps track of its moves to avoid making the same move more than once
    this.movesBoard = Array(10).fill(null).map(row => Array(10).fill(null));
    this.lastMove = {
      x: null,
      y: null
    };
    this.followUpMode = false;
    this.followUpDirection = null;
    this.checkedFollowUpDirections = [];
    this.followUpStartingPoint = {
      row: null,
      col: null
    };
  }
  makeRandomPlacement() {
    const placementFleet = [{
      name: 'Carrier',
      length: 4
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Battleship',
      length: 3
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Cruiser',
      length: 2
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }, {
      name: 'Destroyer',
      length: 1
    }];

    /* WHILE placementFleet.length > 0
      1- Choose two random numbers for coordinates (0,9)
      2- Choose a random number for horizontal/vertical
      3- Create target cells array containing coordinate objects 
      4- Based on ship length and axis, populate targetCells array
      5- Iterate through target cells array and check if corresponding coordinates available
        If not available
          Return to 1st step
        Else if available
          Call placeship
          Remove current ship from placementFleet
    */

    while (placementFleet.length > 0) {
      const location = _utils__WEBPACK_IMPORTED_MODULE_1__["default"].generateRandomCoordinates();
      const axis = _utils__WEBPACK_IMPORTED_MODULE_1__["default"].generateRandomAxis();
      const targetCells = [];
      let placementValid = true;
      for (let i = 0; i < placementFleet[0].length; i++) {
        if (axis === 'horizontal') {
          targetCells.push({
            ...location,
            col: location.col + i
          });
        } else {
          targetCells.push({
            ...location,
            row: location.row + i
          });
        }
      }
      targetCells.forEach(coordinates => {
        const {
          row,
          col
        } = coordinates;
        if (row > 9 || col > 9 || this.boardForShips[row][col] !== 0) {
          placementValid = false;
          return;
        }
      });
      if (placementValid) {
        this.gameBoard.placeShip(location.row, location.col, placementFleet[0].length, axis === 'horizontal');
        placementFleet.shift();
      }
    }
  }
  makeMove(playerShipsBoard, playerMovesBoard) {
    if (this.followUpMode) {
      const [row, col] = this.makeFollowUpMove(playerShipsBoard, playerMovesBoard);
      this.movesBoard[row][col] = true;
      return [row, col];
    } else {
      return this.makeRandomMove(playerMovesBoard);
    }
  }
  makeRandomMove(playerMovesBoard) {
    let row;
    let col;
    while (true) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);

      // Compares current move to former moves, if current move has been made before, it tries again until it finds the unique move
      if (this.movesBoard[row][col] || playerMovesBoard[row][col] === 'M') {
        continue;
      } else {
        this.movesBoard[row][col] = true;
        this.setLastMove(row, col);
        return [row, col];
      }
    }
  }
  setLastMove(row, col) {
    this.lastMove.x = col;
    this.lastMove.y = row;
  }
  makeFollowUpMove(playerShipsBoard, playerMovesBoard) {
    const lastRow = this.lastMove.y;
    const lastCol = this.lastMove.x;
    let row = lastRow;
    let col = lastCol;

    // If a direction was set before, computer will keep shooting on that direction
    if (this.followUpDirection) {
      switch (this.followUpDirection) {
        case 'top':
          row = lastRow - 1;
          // If the next cell of that direction is not shootable, computer should turn to the starting point and keep shooting on the opposite direction (top > bottom, left > right)
          if (!this.checkIfCellShootable(row, col, playerMovesBoard)) {
            this.followUpDirection = 'bottom';
            row = this.followUpStartingPoint.row + 1;
            col = this.followUpStartingPoint.col;
          }
          // If there is no ship on the next cell of that direciton, computer must change direction
          // For that, besides changing the direction, we must set the last move to followUpStartingPoint so it goes back to where it started and start shooting the opposite direction from there,
          if (!(playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"])) {
            this.followUpDirection = 'bottom';
            this.setLastMove(this.followUpStartingPoint.row, this.followUpStartingPoint.col);
            return [row, col];
          }
          break;
        case 'right':
          col = lastCol + 1;
          if (!this.checkIfCellShootable(row, col, playerMovesBoard)) {
            this.followUpDirection = 'left';
            row = this.followUpStartingPoint.row;
            col = this.followUpStartingPoint.col - 1;
          }
          if (!(playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"])) {
            this.followUpDirection = 'left';
            this.setLastMove(this.followUpStartingPoint.row, this.followUpStartingPoint.col);
            return [row, col];
          }
          break;
        case 'bottom':
          row = lastRow + 1;
          if (!this.checkIfCellShootable(row, col, playerMovesBoard)) {
            this.followUpDirection = 'top';
            row = this.followUpStartingPoint.row - 1;
            col = this.followUpStartingPoint;
          }
          if (!(playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"])) {
            this.followUpDirection = 'top';
            this.setLastMove(this.followUpStartingPoint.row, this.followUpStartingPoint.col);
            return [row, col];
          }
          break;
        case 'left':
          col = lastCol - 1;
          if (!this.checkIfCellShootable(row, col, playerMovesBoard)) {
            this.followUpDirection = 'right';
            row = this.followUpStartingPoint.row;
            col = this.followUpStartingPoint.col + 1;
          }
          if (!(playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"])) {
            this.followUpDirection = 'right';
            this.setLastMove(this.followUpStartingPoint.row, this.followUpStartingPoint.col);
            return [row, col];
          }
          break;
      }
      this.setLastMove(row, col);
      return [row, col];
    }
    // If no direction was set before, computer will try directions one by one until it finds the rest of the ship and sets the direction
    else {
      row = this.followUpStartingPoint.row;
      col = this.followUpStartingPoint.col;
      if (!this.checkedFollowUpDirections.includes('top')) {
        this.checkedFollowUpDirections.push('top');
        // If shootable, return the coordinates
        if (this.checkIfCellShootable(this.followUpStartingPoint.row - 1, this.followUpStartingPoint.col, playerMovesBoard)) {
          row = this.followUpStartingPoint.row - 1;
          // Also if there is a ship, set the followUpDirection
          if (playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            this.followUpDirection = 'top';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('right')) {
        this.checkedFollowUpDirections.push('right');
        if (this.checkIfCellShootable(this.followUpStartingPoint.row, this.followUpStartingPoint.col + 1, playerMovesBoard)) {
          col = this.followUpStartingPoint.col + 1;
          if (playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            this.followUpDirection = 'right';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('bottom')) {
        this.checkedFollowUpDirections.push('bottom');
        if (this.checkIfCellShootable(this.followUpStartingPoint.row + 1, this.followUpStartingPoint.col, playerMovesBoard)) {
          row = this.followUpStartingPoint.row + 1;
          if (playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            this.followUpDirection = 'bottom';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
      if (!this.checkedFollowUpDirections.includes('left')) {
        this.checkedFollowUpDirections.push('left');
        if (this.checkIfCellShootable(this.followUpStartingPoint.row, this.followUpStartingPoint.col - 1, playerMovesBoard)) {
          col = this.followUpStartingPoint.col - 1;
          if (playerShipsBoard[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            console.log('SETTING DIRECTION LEFT');
            this.followUpDirection = 'left';
          }
          this.setLastMove(row, col);
          return [row, col];
        }
      }
    }
  }
  activateFollowUpMode(row, col) {
    this.followUpMode = true;
    this.followUpStartingPoint.row = row;
    this.followUpStartingPoint.col = col;
  }
  deactivateFollowUpMode() {
    this.followUpMode = false;
    this.followUpStartingPoint.x = null;
    this.followUpStartingPoint.y = null;
    this.followUpDirection = null;
    this.checkedFollowUpDirections.length = [];
    console.log(this.checkedFollowUpDirections);
  }
  checkIfCellShootable(row, col, playerMovesBoard) {
    if (row > 9 || col > 9 || row < 0 || col < 0) {
      return false;
    } else if (this.movesBoard[row][col] || playerMovesBoard[row][col] === 'M') {
      return false;
    } else {
      return true;
    }
  }
}

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  constructor(length, axis) {
    this.axis = axis;
    this.length = length;
    this.timesHit = 0;
  }
  hit() {
    this.timesHit += 1;
  }
  isSunken() {
    return this.timesHit === this.length;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./src/modules/utils.js":
/*!******************************!*\
  !*** ./src/modules/utils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Utils = function () {
  const delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const generateRandomCoordinates = () => {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return {
      row,
      col
    };
  };
  const generateRandomAxis = () => {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  };
  return {
    delay,
    generateRandomCoordinates,
    generateRandomAxis
  };
}();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.game-section.battle {
  justify-content: center;
  gap: 120px;
  margin-top: 30px;
}

.turn {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
}

.game-section.battle.active.blurred .turn {
  display: none;
}

.player-one-section,
.player-two-section {
  min-width: fit-content;
  display: flex;
  gap: 60px;
}

.fleet-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.fleet-header {
  height: 40px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.fleet {
  border: 2px solid black;
  border-radius: 5px;
  width: 250px;
  height: 250px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 25px;
}

.fleet-ship-container {
  display: flex;
  height: 20px;
}

.ship-part {
  width: 20px;
  height: 20px;
  background-color: blue;
}

.part-sunken {
  background-color: red;
}
`, "",{"version":3,"sources":["webpack://./src/styles/battle.css"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,UAAU;EACV,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,2BAA2B;EAC3B,eAAe;EACf,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;;EAEE,sBAAsB;EACtB,aAAa;EACb,SAAS;AACX;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,aAAa;EACb,mBAAmB;EACnB,iBAAiB;AACnB;;AAEA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,YAAY;EACZ,aAAa;EACb,aAAa;EACb,SAAS;EACT,eAAe;EACf,aAAa;AACf;;AAEA;EACE,aAAa;EACb,YAAY;AACd;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB","sourcesContent":[".game-section.battle {\n  justify-content: center;\n  gap: 120px;\n  margin-top: 30px;\n}\n\n.turn {\n  position: absolute;\n  bottom: 15%;\n  left: 50%;\n  transform: translateX(-50%);\n  font-size: 2rem;\n  font-weight: bold;\n}\n\n.game-section.battle.active.blurred .turn {\n  display: none;\n}\n\n.player-one-section,\n.player-two-section {\n  min-width: fit-content;\n  display: flex;\n  gap: 60px;\n}\n\n.fleet-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-top: 5px;\n}\n\n.fleet-header {\n  height: 40px;\n  font-size: 1.3rem;\n  display: flex;\n  align-items: center;\n  font-weight: bold;\n}\n\n.fleet {\n  border: 2px solid black;\n  border-radius: 5px;\n  width: 250px;\n  height: 250px;\n  display: flex;\n  gap: 20px;\n  flex-wrap: wrap;\n  padding: 25px;\n}\n\n.fleet-ship-container {\n  display: flex;\n  height: 20px;\n}\n\n.ship-part {\n  width: 20px;\n  height: 20px;\n  background-color: blue;\n}\n\n.part-sunken {\n  background-color: red;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/boards.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/boards.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `table {
  border-collapse: collapse;
  height: 100%;
}

caption {
  caption-side: bottom;
  margin-top: 20px;
}

td {
  background-color: rgba(59, 131, 246, 0.808);
  background-color: rgba(81, 148, 255, 0.808);
}

td,
th {
  height: 45px;
  width: 45px;
  text-align: center;
  font-size: 1.5rem;
  border: 1px solid rgb(30, 58, 138);
  transition: background-color 150ms;
}

td.opponent.empty:hover {
  background-color: rgb(29, 78, 216);
  cursor: pointer;
}

td.opponent.empty:active {
  background-color: rgb(54, 99, 223);
  cursor: pointer;
}

th {
  border: none;
  font-weight: normal;
  font-size: 1rem;
}

.ship-cell {
  position: relative;
}

.ship-cell.empty.player-ship {
  background-color: rgb(0, 60, 255);
}

.ship-cell > img {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.missed-shot {
  background-color: rgb(187, 1, 1);
  opacity: 0.6;
}

.last-missed-shot {
  background-color: rgb(187, 1, 1);
  opacity: 0.9;
}

.hit {
  background-color: greenyellow;
}

.sunken {
  background: repeating-linear-gradient(
    45deg,
    rgb(6, 6, 48),
    rgba(32, 94, 192, 0.808)
  );
}

.deactive {
  pointer-events: none;
}
`, "",{"version":3,"sources":["webpack://./src/styles/boards.css"],"names":[],"mappings":"AAAA;EACE,yBAAyB;EACzB,YAAY;AACd;;AAEA;EACE,oBAAoB;EACpB,gBAAgB;AAClB;;AAEA;EACE,2CAA2C;EAC3C,2CAA2C;AAC7C;;AAEA;;EAEE,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,iBAAiB;EACjB,kCAAkC;EAClC,kCAAkC;AACpC;;AAEA;EACE,kCAAkC;EAClC,eAAe;AACjB;;AAEA;EACE,kCAAkC;EAClC,eAAe;AACjB;;AAEA;EACE,YAAY;EACZ,mBAAmB;EACnB,eAAe;AACjB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,YAAY;EACZ,WAAW;EACX,kBAAkB;EAClB,QAAQ;EACR,SAAS;EACT,gCAAgC;AAClC;;AAEA;EACE,gCAAgC;EAChC,YAAY;AACd;;AAEA;EACE,gCAAgC;EAChC,YAAY;AACd;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE;;;;GAIC;AACH;;AAEA;EACE,oBAAoB;AACtB","sourcesContent":["table {\n  border-collapse: collapse;\n  height: 100%;\n}\n\ncaption {\n  caption-side: bottom;\n  margin-top: 20px;\n}\n\ntd {\n  background-color: rgba(59, 131, 246, 0.808);\n  background-color: rgba(81, 148, 255, 0.808);\n}\n\ntd,\nth {\n  height: 45px;\n  width: 45px;\n  text-align: center;\n  font-size: 1.5rem;\n  border: 1px solid rgb(30, 58, 138);\n  transition: background-color 150ms;\n}\n\ntd.opponent.empty:hover {\n  background-color: rgb(29, 78, 216);\n  cursor: pointer;\n}\n\ntd.opponent.empty:active {\n  background-color: rgb(54, 99, 223);\n  cursor: pointer;\n}\n\nth {\n  border: none;\n  font-weight: normal;\n  font-size: 1rem;\n}\n\n.ship-cell {\n  position: relative;\n}\n\n.ship-cell.empty.player-ship {\n  background-color: rgb(0, 60, 255);\n}\n\n.ship-cell > img {\n  height: 30px;\n  width: 30px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.missed-shot {\n  background-color: rgb(187, 1, 1);\n  opacity: 0.6;\n}\n\n.last-missed-shot {\n  background-color: rgb(187, 1, 1);\n  opacity: 0.9;\n}\n\n.hit {\n  background-color: greenyellow;\n}\n\n.sunken {\n  background: repeating-linear-gradient(\n    45deg,\n    rgb(6, 6, 48),\n    rgba(32, 94, 192, 0.808)\n  );\n}\n\n.deactive {\n  pointer-events: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/game-over.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/game-over.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.game-over-msg {
  position: absolute;
  top: 110px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
}

.play-again-btn {
  position: absolute;
  top: 160px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
  border: none;
  background-color: white;
  border: none;
  background-color: rgb(156, 18, 18);
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 150ms;
  padding: 0.5rem;
  border-radius: 1000px;
}

.play-again-btn:hover {
  background-color: rgb(187, 40, 40);
}

.winner {
  background-color: rgb(4, 209, 4);
}

.loser {
  background-color: red;
}
`, "",{"version":3,"sources":["webpack://./src/styles/game-over.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gCAAgC;EAChC,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gCAAgC;EAChC,iBAAiB;EACjB,YAAY;EACZ,uBAAuB;EACvB,YAAY;EACZ,kCAAkC;EAClC,YAAY;EACZ,iBAAiB;EACjB,iBAAiB;EACjB,eAAe;EACf,kCAAkC;EAClC,eAAe;EACf,qBAAqB;AACvB;;AAEA;EACE,kCAAkC;AACpC;;AAEA;EACE,gCAAgC;AAClC;;AAEA;EACE,qBAAqB;AACvB","sourcesContent":[".game-over-msg {\n  position: absolute;\n  top: 110px;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.8rem;\n}\n\n.play-again-btn {\n  position: absolute;\n  top: 160px;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.8rem;\n  border: none;\n  background-color: white;\n  border: none;\n  background-color: rgb(156, 18, 18);\n  color: white;\n  font-weight: bold;\n  font-size: 1.5rem;\n  cursor: pointer;\n  transition: background-color 150ms;\n  padding: 0.5rem;\n  border-radius: 1000px;\n}\n\n.play-again-btn:hover {\n  background-color: rgb(187, 40, 40);\n}\n\n.winner {\n  background-color: rgb(4, 209, 4);\n}\n\n.loser {\n  background-color: red;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_boards_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./boards.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/boards.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_placement_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./placement.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/placement.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./battle.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/battle.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_game_over_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./game-over.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/game-over.css");
// Imports






var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_boards_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_placement_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_battle_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_game_over_css__WEBPACK_IMPORTED_MODULE_5__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

body {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 100px;
  background-color: rgba(59, 131, 246, 0.808);
}

header {
  text-align: center;
  font-size: 2rem;
  letter-spacing: 32px;
  background-color: rgb(12, 60, 71);
  color: white;
}

.game-section {
  display: flex;
}

.game-section.blurred {
  opacity: 0.5;
  pointer-events: none;
}

.game-section.blurred {
  pointer-events: none;
}
`, "",{"version":3,"sources":["webpack://./src/styles/main.css"],"names":[],"mappings":"AAKA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;EACtB,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,aAAa;EACb,sBAAsB;EACtB,UAAU;EACV,2CAA2C;AAC7C;;AAEA;EACE,kBAAkB;EAClB,eAAe;EACf,oBAAoB;EACpB,iCAAiC;EACjC,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,YAAY;EACZ,oBAAoB;AACtB;;AAEA;EACE,oBAAoB;AACtB","sourcesContent":["@import './boards.css';\n@import './placement.css';\n@import './battle.css';\n@import './game-over.css';\n\n*,\n*::after,\n*::before {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: sans-serif;\n}\n\nbody {\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  gap: 100px;\n  background-color: rgba(59, 131, 246, 0.808);\n}\n\nheader {\n  text-align: center;\n  font-size: 2rem;\n  letter-spacing: 32px;\n  background-color: rgb(12, 60, 71);\n  color: white;\n}\n\n.game-section {\n  display: flex;\n}\n\n.game-section.blurred {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.game-section.blurred {\n  pointer-events: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/placement.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/placement.css ***!
  \************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root {
  --placement-ship-size: 35px;
}

.game-section.placement {
  gap: 200px;
  justify-content: center;
  margin-top: 20px;
}

.game-section.placement > h2 {
  position: absolute;
  top: 110px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
}

.placement-error-message {
  margin-top: 45px;
  font-size: 2rem;
  color: rgb(134, 12, 12);
}

.game-section.placement > div {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.placement-fleet {
  margin-top: 41px;
  width: 300px;
  height: 300px;
  border: 2px solid black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
}

.placement-line {
  display: flex;
  justify-content: space-between;
}

.placement-ship {
  background-color: blue;
  height: var(--placement-ship-size);
  border: 1px solid white;
}

td[data-adjacent='true'] {
  background-color: rgba(207, 180, 180, 0.781);
}

td[data-occupied='true'] {
  background-color: blue;
}

.placement-ship[data-length='4'] {
  width: calc(var(--placement-ship-size) * 4);
}

.placement-ship[data-length='3'] {
  width: calc(var(--placement-ship-size) * 3);
}

.placement-ship[data-length='2'] {
  width: calc(var(--placement-ship-size) * 2);
}

.placement-ship[data-length='1'] {
  width: calc(var(--placement-ship-size) * 1);
}

.start-game-btn {
  border: none;
  background-color: rgb(156, 18, 18);
  color: rgb(39, 39, 39);
  font-weight: bold;
  font-size: 1.8rem;
  cursor: pointer;
  transition: box-shadow 150ms;
  padding: 0.8rem;
  border-radius: 5px;
  background-color: rgb(5, 216, 5);
}

.start-game-btn:hover {
  box-shadow: 1px 1px 20px rgb(255, 255, 255);
}

.start-game-btn:active {
  transform: translate(2px, 2px);
}

.board-buttons {
  display: flex;
  gap: 20px;
}

.board-buttons > button {
  font-size: 1.3rem;
  width: 140px;
  border: none;
  background-color: blueviolet;
  cursor: pointer;
  padding: 6px 6px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  box-shadow: 1px 1px 3px black;
}

.board-buttons > button:active {
  transform: translate(2px, 2px);
}

.shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translate(-50%, -50%) translateX(0);
  }
  25% {
    transform: translate(-50%, -50%) translateX(-3px);
  }
  50% {
    transform: translate(-50%, -50%) translateX(3px);
  }
  75% {
    transform: translate(-50%, -50%) translateX(-3px);
  }
  100% {
    transform: translate(-50%, -50%) translateX(0);
  }
}
`, "",{"version":3,"sources":["webpack://./src/styles/placement.css"],"names":[],"mappings":"AAAA;EACE,2BAA2B;AAC7B;;AAEA;EACE,UAAU;EACV,uBAAuB;EACvB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gCAAgC;EAChC,iBAAiB;AACnB;;AAEA;EACE,gBAAgB;EAChB,eAAe;EACf,uBAAuB;AACzB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;EACT,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;EAChB,YAAY;EACZ,aAAa;EACb,uBAAuB;EACvB,kBAAkB;EAClB,aAAa;EACb,sBAAsB;EACtB,8BAA8B;EAC9B,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,8BAA8B;AAChC;;AAEA;EACE,sBAAsB;EACtB,kCAAkC;EAClC,uBAAuB;AACzB;;AAEA;EACE,4CAA4C;AAC9C;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,YAAY;EACZ,kCAAkC;EAClC,sBAAsB;EACtB,iBAAiB;EACjB,iBAAiB;EACjB,eAAe;EACf,4BAA4B;EAC5B,eAAe;EACf,kBAAkB;EAClB,gCAAgC;AAClC;;AAEA;EACE,2CAA2C;AAC7C;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,aAAa;EACb,SAAS;AACX;;AAEA;EACE,iBAAiB;EACjB,YAAY;EACZ,YAAY;EACZ,4BAA4B;EAC5B,eAAe;EACf,gBAAgB;EAChB,kBAAkB;EAClB,YAAY;EACZ,iBAAiB;EACjB,6BAA6B;AAC/B;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE;IACE,8CAA8C;EAChD;EACA;IACE,iDAAiD;EACnD;EACA;IACE,gDAAgD;EAClD;EACA;IACE,iDAAiD;EACnD;EACA;IACE,8CAA8C;EAChD;AACF","sourcesContent":[":root {\n  --placement-ship-size: 35px;\n}\n\n.game-section.placement {\n  gap: 200px;\n  justify-content: center;\n  margin-top: 20px;\n}\n\n.game-section.placement > h2 {\n  position: absolute;\n  top: 110px;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.8rem;\n}\n\n.placement-error-message {\n  margin-top: 45px;\n  font-size: 2rem;\n  color: rgb(134, 12, 12);\n}\n\n.game-section.placement > div {\n  display: flex;\n  flex-direction: column;\n  gap: 40px;\n  align-items: center;\n}\n\n.placement-fleet {\n  margin-top: 41px;\n  width: 300px;\n  height: 300px;\n  border: 2px solid black;\n  border-radius: 5px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 1.5rem;\n}\n\n.placement-line {\n  display: flex;\n  justify-content: space-between;\n}\n\n.placement-ship {\n  background-color: blue;\n  height: var(--placement-ship-size);\n  border: 1px solid white;\n}\n\ntd[data-adjacent='true'] {\n  background-color: rgba(207, 180, 180, 0.781);\n}\n\ntd[data-occupied='true'] {\n  background-color: blue;\n}\n\n.placement-ship[data-length='4'] {\n  width: calc(var(--placement-ship-size) * 4);\n}\n\n.placement-ship[data-length='3'] {\n  width: calc(var(--placement-ship-size) * 3);\n}\n\n.placement-ship[data-length='2'] {\n  width: calc(var(--placement-ship-size) * 2);\n}\n\n.placement-ship[data-length='1'] {\n  width: calc(var(--placement-ship-size) * 1);\n}\n\n.start-game-btn {\n  border: none;\n  background-color: rgb(156, 18, 18);\n  color: rgb(39, 39, 39);\n  font-weight: bold;\n  font-size: 1.8rem;\n  cursor: pointer;\n  transition: box-shadow 150ms;\n  padding: 0.8rem;\n  border-radius: 5px;\n  background-color: rgb(5, 216, 5);\n}\n\n.start-game-btn:hover {\n  box-shadow: 1px 1px 20px rgb(255, 255, 255);\n}\n\n.start-game-btn:active {\n  transform: translate(2px, 2px);\n}\n\n.board-buttons {\n  display: flex;\n  gap: 20px;\n}\n\n.board-buttons > button {\n  font-size: 1.3rem;\n  width: 140px;\n  border: none;\n  background-color: blueviolet;\n  cursor: pointer;\n  padding: 6px 6px;\n  border-radius: 5px;\n  color: white;\n  font-weight: bold;\n  box-shadow: 1px 1px 3px black;\n}\n\n.board-buttons > button:active {\n  transform: translate(2px, 2px);\n}\n\n.shake {\n  animation: shake 0.4s ease-in-out;\n}\n\n@keyframes shake {\n  0% {\n    transform: translate(-50%, -50%) translateX(0);\n  }\n  25% {\n    transform: translate(-50%, -50%) translateX(-3px);\n  }\n  50% {\n    transform: translate(-50%, -50%) translateX(3px);\n  }\n  75% {\n    transform: translate(-50%, -50%) translateX(-3px);\n  }\n  100% {\n    transform: translate(-50%, -50%) translateX(0);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/assets/dot.svg":
/*!****************************!*\
  !*** ./src/assets/dot.svg ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "dot.svg";

/***/ }),

/***/ "./src/assets/ferry.svg":
/*!******************************!*\
  !*** ./src/assets/ferry.svg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "ferry.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundleca05694eb0a23d2501fe.js.map