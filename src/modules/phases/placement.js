import Ship from '../ship';
import Utils from '../utils';
import Battle from './battle';

const Placement = (function () {
  let placementFleet;
  let axis = 'horizontal';
  let playerOne;
  let playerTwo;

  const init = function (player, computer) {
    placementFleet = [
      {
        name: 'Carrier',
        length: 4,
        placed: false,
      },
      {
        name: 'Battleship',
        length: 3,
        placed: false,
      },
      {
        name: 'Battleship',
        length: 3,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
    ];

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
        <h2 class="placement-header">${
          placementFleet[0]
            ? 'Place your ' + placementFleet[0].name
            : 'You are ready for battle!'
        }</h2>
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

    document
      .querySelector('.reset-placement-btn')
      .addEventListener('click', () => {
        resetPlacement();
      });
  };

  async function handleStartGame() {
    if (placementFleet.length === 0) {
      Battle.init(playerOne, playerTwo);
    } else {
      const header = document.querySelector('.placement-header');
      header.classList.add('shake');
      await Utils.delay(400);
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
      const shipsForLine = placementFleet.filter(
        (ship) => ship.length === shipLength
      );
      shipsForLine.forEach((ship) => {
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
      playerOne.gameBoard.placeShip(
        row,
        col,
        placementFleet[0].length,
        axis === 'horizontal'
      );
      placementFleet.shift();
      renderScreen();
    } catch (err) {
      handlePlacementError(err);
    }
  };

  const handleHoverCell = function (cell) {
    const startCell = {
      posX: Number(cell.dataset.posX),
      posY: Number(cell.dataset.posY),
    };

    const previewCells = getPreviewCells(startCell, placementFleet[0].length);
    let isPlacementValid = true;

    previewCells.forEach((cell) => {
      if (!cell || cell.dataset.occupied || cell.dataset.adjacent) {
        isPlacementValid = false;
      }
    });

    if (isPlacementValid) {
      previewCells.forEach((cell) => {
        cell.style.backgroundColor = 'blue';
      });
    } else {
      previewCells.forEach((cell) => {
        if (cell) {
          cell.style.backgroundColor = 'red';
        }
      });
    }
  };

  const handleMouseLeaveCell = function (cell) {
    const startCell = {
      posX: Number(cell.dataset.posX),
      posY: Number(cell.dataset.posY),
    };

    const previewCells = getPreviewCells(startCell, placementFleet[0].length);

    previewCells.forEach((cell) => {
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

      const cell = document.querySelector(
        `td[data-pos-x="${posX}"][data-pos-y="${posY}"]`
      );

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
            tCell.addEventListener('mouseover', (e) => {
              if (placementFleet.length > 0) {
                handleHoverCell(e.target);
              }
            });

            tCell.addEventListener('mouseleave', (e) => {
              if (placementFleet.length > 0) {
                handleMouseLeaveCell(e.target);
              }
            });
          } else if (shipsBoard[row][col] === 'A') {
            tCell.dataset['adjacent'] = true;
          } else if (shipsBoard[row][col] instanceof Ship) {
            tCell.dataset['occupied'] = true;
          }
          tCell.addEventListener('click', (e) => {
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
    placementFleet = [
      {
        name: 'Carrier',
        length: 4,
        placed: false,
      },
      {
        name: 'Battleship',
        length: 3,
        placed: false,
      },
      {
        name: 'Battleship',
        length: 3,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Cruiser',
        length: 2,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
      {
        name: 'Destroyer',
        length: 1,
        placed: false,
      },
    ];
    renderScreen();
  };

  const handlePlacementError = function (err) {
    const container = document.querySelector('.placement-error-message');
    container.textContent = err.message;
  };

  return { init };
})();

export default Placement;
