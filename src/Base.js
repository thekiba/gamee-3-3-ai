class Base {

  constructor () {
    
  }

  /**
   * Set value to virtual grid.
   * @param grid {Array}
   * @param t {Number} position
   * @param e {Number} value
   */
  setGrid (grid, t, e) {
    grid[t[1] * this.game.gridSize + t[0]] = e;
  };

  /**
   * @param t {Number}
   * @return {Array} position on grid
   */
  getPos (t) {
    return [t % this.game.gridSize, Math.floor(t / this.game.gridSize)];
  };

  /**
   * @param o {Array} direction
   * @return {Boolean}
   */
  canMove (grid, o) {
    return this.moveGrid(o, grid, !0);
  };

  /**
   * @param t {Array} direction
   * @param grid {Array}
   * @param e {Boolean} если true, то запускается в режиме проверки возможности хода
   * @return {Number|Boolean} score
   */
  moveGrid (t, grid, e) {
    var score = +this.game.score;

    var o = void 0, n = void 0, i = void 0, r = void 0, s = void 0, a = [], u = 0;

    if (t[0]) {
      o = t[0];
      i = o > 0 ? 0 : this.game.gridSize - 1;
      s = o > 0 ? this.game.gridSize - 1 : 0;
      r = 0;
      n = this.game.gridSize;
    } else {
      o = t[1] * this.game.gridSize;
      i = o > 0 ? 0 : (this.game.gridSize - 1) * this.game.gridSize;
      s = o > 0 ? (this.game.gridSize - 1) * this.game.gridSize : 0 * this.game.gridSize;
      r = 0;
      n = 1;
    }
      
    for (var c = r, d = 0; d < this.game.gridSize; c += n, d++)
      for (var h = 0, p = 0, l = void 0, g = void 0, f = i, m = 0; m < this.game.gridSize; f += o, m++) {
        var y = c + f, w = grid[y];

        0 == h && w && (h = w, l = y);

        if (0 != h) {
          g = l == c + s ? l : l + o;
          p = l != g ? grid[g] : 0;
        }

        var b = l == c + i ? l : l - o, v = grid[b], k = 0 == v ? b : l;

        if (h + p == 3 && h * p != 0 || h > 2 && h < this.game.maxNum && h == p) {
          if (!e) {
            score += h + p;

            this.setGrid(grid, this.getPos(g), 0);
            this.setGrid(grid, this.getPos(l), 0);
            this.setGrid(grid, this.getPos(k), h + p);
          }

          h = 0;
          u = 1;
        } else {
          if (h) {
            if (!e) {
              this.setGrid(grid, this.getPos(l), 0);
              this.setGrid(grid, this.getPos(k), h);
            };
            l != k && (u = 1);
            h = p;
            l = g;
          }
        };
      };

    return e ? u === 1 : score;
  }
}

module.exports = Base;