import Game from './game-controller';

const EventHandlers = (function () {
  const handleCellClick = function (e, player) {
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

    const row = cell.dataset.posY;
    const col = cell.dataset.posX;

    Game.playRound(row, col);
  };

  return {
    handleCellClick,
  };
})();

export default EventHandlers;
