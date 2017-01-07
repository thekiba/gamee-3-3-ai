const Game = require('./src/Game.js');
const Ai = require('./src/Ai.js');

let game, ai;

var count = 10;
var results = [];
var best = [];

run();

function run () {
  game = new Game();
  ai = new Ai(game);

  loop();
};

function loop () {
  let bestMove = ai.bestMove();

  // if (!bestMove)
  //   return run();

  game.move(bestMove);
  game.generateCell();

  if (!game.isWin()) {
    console.log(game.score, bestMove);
    console.log(game.grid.slice(0, 4));
    console.log(game.grid.slice(4, 8));
    console.log(game.grid.slice(8, 12));
    console.log(game.grid.slice(12, 16));
    console.log('');

    setTimeout(loop, 0);
  } else {
    results.push(game.score);

    if (game.score >= Math.max.apply(this, results)) {
      best = game.grid.slice();
    }

    if (count-- > 0) {
      setTimeout(run, 0);
    } else {
      done(); 
    }
  }
};

function done () {
  console.log('Best', Math.max.apply(this, results), results);

  console.log(best.slice(0, 4));
  console.log(best.slice(4, 8));
  console.log(best.slice(8, 12));
  console.log(best.slice(12, 16));
};