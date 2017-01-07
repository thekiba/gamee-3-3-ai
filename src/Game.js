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

class Game extends Base {

  constructor () {
    super();

    this.game = this;

    this.grid = Array(16).fill(0);
    this.gridSize = 4;
    this.maxNum = 6144;
    this.score = 0;
    this.food = 2;

    this.generateCell();
    this.generateCell();
  }

  move (key) {
    let direction = directions.get(key);

    if (this.canMove(this.grid, direction))
      this.score = this.moveGrid(direction, this.grid);
    else 
      throw new Error('Can not move', this.grid, 'with', direction);
  }

  isWin () {
    return !this.canMove(this.grid, directions.get(buttons.left))
        && !this.canMove(this.grid, directions.get(buttons.right))
        && !this.canMove(this.grid, directions.get(buttons.up))
        && !this.canMove(this.grid, directions.get(buttons.down));
  }

  generateCell () {
    let avaliables = this.grid.map((v, k) => v == 0 && k).filter(v => v);
    let cell = avaliables[Math.floor(Math.random()*avaliables.length)];

    this.grid[cell] = this.food = 1 == this.food ? 2 : 1;
  }

}

module.exports = Game;