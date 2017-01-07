const Base = require('./Base.js');

const buttons = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const directions = new Map([
  [ buttons.up, [0, 1] ],
  [ buttons.left, [1, 0] ],
  [ buttons.down, [0, -1] ],
  [ buttons.right, [-1, 0] ],
]);

class Ai extends Base {

  constructor (game) {
    super();

    this.game = game;
  }

  /**
   * @return {Number} direction
   */
  bestMove () {
    let bestScore = 1;
    let bestKey = void 0;
    // let scores = {};

    /**
     * Поиск лучшего направления.
     */
    directions.forEach((direction, key) => {
      let isRight = key === buttons.right;

      if (isRight)
        if (this.game.grid[0] === 0 || this.game.grid[1] === 0 || this.game.grid[2] === 0 || this.game.grid[3] === 0)
          return false;

      if (key === buttons.down)
        return false;

      if (!this.canMove(this.game.grid, direction))
        return false;

      let grid = this.game.grid.slice();
      let differenceScore = this.moveGrid(direction, grid) - this.game.score;

      if (isRight)
        if (0 === grid[0] || 0 === grid[1] || 0 === grid[2] || 0 === grid[3])
          return false;

      let avaliables = grid.map((v, k) => v === 0 && k).filter(v => v);

      if (avaliables.length === 1) {
        grid[avaliables[0]] = this.game.food;
      }

      if (!this.canMove(grid, directions.get(buttons.left))
       && !this.canMove(grid, directions.get(buttons.up))
       && !this.canMove(grid, directions.get(buttons.down))
       && !this.canMove(grid, directions.get(buttons.right))) {
        return false;
      }

      if (differenceScore > bestScore) {
        bestScore = differenceScore;
        bestKey = key;
      };

      /**
       * Поиск лучшего решения для второго хода после предыдущего.
       */
      directions.forEach((direction2, key2) => {
        let grid2 = grid.slice();

        if (this.canMove(grid2, direction2)) {
          let differenceScore2 = this.moveGrid(direction2, grid2) - this.game.score;

          let avaliables = grid2.map((v, k) => v === 0 && k).filter(v => v);

          if (avaliables.length === 1) {
            grid2[avaliables[0]] = (1 == this.game.food ? 2 : 1);
          }

          if (!this.canMove(grid2, directions.get(buttons.left))
           && !this.canMove(grid2, directions.get(buttons.up))
           && !this.canMove(grid2, directions.get(buttons.down))
           && !this.canMove(grid2, directions.get(buttons.right))) {
            return false;
          }

          if (isRight) {
            if (key2 !== buttons.up)
              return false;
            if (0 === grid2[0] || 0 === grid2[1] || 0 === grid2[2] || 0 === grid2[3])
              return false;
          }

          if (differenceScore2 > bestScore) {
            bestScore = differenceScore2;
            bestKey = key;
          };
        }
      }, this);
    }, this);

    /**
     * Если ход не выбран, то выбрать доступный оптимальный по весам.
     */
    if (!bestKey)
      directions.forEach((direction, key) => {
        let grid = this.game.grid.slice();

        if (key === buttons.right)
          return false;

        if (key === buttons.down)
          return false;

        if (!this.canMove(this.game.grid, direction))
          return false;

        this.moveGrid(direction, grid);

        let avaliables = grid.map((v, k) => v === 0 && k).filter(v => v);

        if (avaliables.length === 1) {
          grid[avaliables[0]] = this.game.food;
        }

        if (!this.canMove(grid, directions.get(buttons.left))
         && !this.canMove(grid, directions.get(buttons.up))
         && !this.canMove(grid, directions.get(buttons.down))
         && !this.canMove(grid, directions.get(buttons.right))) {
          return false;
        }

        bestKey = key;
      }, this);

    /**
     * Если ход не выбран, то выбрать ход вправо.
     */
    if (!bestKey)
      if (this.canMove(this.game.grid, directions.get(buttons.right)))
        bestKey = buttons.right;

    /**
     * Если ход не выбран, то выбрать ход вправо.
     */
    if (!bestKey)
      if (this.canMove(this.game.grid, directions.get(buttons.down)))
        bestKey = buttons.down;

    return bestKey;
  }
}

module.exports = Ai;