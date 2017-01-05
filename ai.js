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

/**
 * @example loop.call(game)
 */
function loop () {
  let bestScore = 1;
  let bestKey = void 0;

  /**
   * Поиск лучшего направления.
   */
  directions.forEach((direction, key) => {
    let isRight = key === buttons.right;

    if (isRight)
      if (this.grid[0] === 0 || this.grid[1] === 0 || this.grid[2] === 0 || this.grid[3] === 0)
        return false;

    if (key === buttons.down)
      return false;

    if (!canMove.call(this, this.grid, direction))
      return false;

    let grid = this.grid.slice();
    let differenceScore = score.call(this, direction, grid) - this.score;

    if (isRight)
      if (0 === grid[0] || 0 === grid[1] || 0 === grid[2] || 0 === grid[3])
        return false;

    if (differenceScore > bestScore) {
      bestScore = differenceScore;
      bestKey = key;
    };

    /**
     * Поиск лучшего решения для второго хода после предыдущего.
     */
    directions.forEach((direction2, key2) => {
      let grid2 = grid.slice();

      if (canMove.call(this, grid2, direction2)) {
        let differenceScore2 = score.call(this, direction2, grid2) - this.score;

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
      if (key === buttons.right)
        return false;

      if (key === buttons.down)
        return false;

      if (!canMove.call(this, this.grid, direction))
        return false;

      bestKey = key;
    }, this);

  /**
   * Если ход не выбран, то выбрать ход вправо.
   */
  if (!bestKey)
    if (canMove.call(this, this.grid, directions.get(buttons.right)))
      bestKey = buttons.right;

  this.keyPressed = bestKey;
};

/**
 * Set value to virtual grid.
 * @param grid {Array}
 * @param t {Number} position
 * @param e {Number} value
 */
function setGrid (grid, t, e) {
  grid[t[1] * this.gridSize + t[0]] = e;
};

/**
 * @param t {Number}
 * @return {Array} position on grid
 */
function getPos (t) {
  return [t % this.gridSize, Math.floor(t / this.gridSize)];
};

/**
 * @param o {Array} direction
 * @return {Boolean}
 */
function canMove (grid, o) {
  return score.call(this, o, grid, !0);
};

/**
 * @param t {Array} direction
 * @param grid {Array}
 * @param e {Boolean} если true, то запускается в режиме проверки возможности хода
 * @return {Number|Boolean} score
 */
function score (t, grid, e) {
  var score = +this.score;

  var o = void 0, n = void 0, i = void 0, r = void 0, s = void 0, a = [], u = 0;

  if (t[0]) {
    o = t[0];
    i = o > 0 ? 0 : this.gridSize - 1;
    s = o > 0 ? this.gridSize - 1 : 0;
    r = 0;
    n = this.gridSize;
  } else {
    o = t[1] * this.gridSize;
    i = o > 0 ? 0 : (this.gridSize - 1) * this.gridSize;
    s = o > 0 ? (this.gridSize - 1) * this.gridSize : 0 * this.gridSize;
    r = 0;
    n = 1;
  }
    
  for (var c = r, d = 0; d < this.gridSize; c += n, d++)
    for (var h = 0, p = 0, l = void 0, g = void 0, f = i, m = 0; m < this.gridSize; f += o, m++) {
      var y = c + f, w = grid[y];

      0 == h && w && (h = w, l = y);

      if (0 != h) {
        g = l == c + s ? l : l + o;
        p = l != g ? grid[g] : 0;
      }

      var b = l == c + i ? l : l - o, v = grid[b], k = 0 == v ? b : l;

      if (h + p == 3 && h * p != 0 || h > 2 && h < this.maxNum && h == p) {
        if (!e) {
          score += h + p;

          setGrid.call(this, grid, getPos.call(this, g), 0);
          setGrid.call(this, grid, getPos.call(this, l), 0);
          setGrid.call(this, grid, getPos.call(this, k), h + p);
        }

        h = 0;
        u = 1;
      } else {
        if (h) {
          if (!e) {
            setGrid.call(this, grid, getPos.call(this, l), 0);
            setGrid.call(this, grid, getPos.call(this, k), h);
          };
          l != k && (u = 1);
          h = p;
          l = g;
        }
      };
    };

  return e ? u === 1 : score;
};

var interval = setInterval(loop.bind(game), 100);