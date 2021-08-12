var loop = require('./loop');
var rand = require('./rand');
var key = require('./key');
var mouse = require('./mouse');

var canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = '#000';
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

const gameState = {
  player: {
    x: rand.int(canvas.width),
    y: rand.int(canvas.height),
    width: 25,
    height: 25,
    speed: 150,
    color: 'rgba(236, 94, 103, 1)'
  },
  projectiles: [],
}

// game loop
loop.start(function (dt) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // update gameState.player
  if (key.isDown(key.LEFT)) {
    gameState.player.x = gameState.player.x - (gameState.player.speed * dt);
  }
  if (key.isDown(key.RIGHT)) {
    gameState.player.x = gameState.player.x + (gameState.player.speed * dt);
  }
  if (key.isDown(key.UP)) {
    gameState.player.y = gameState.player.y - (gameState.player.speed * dt);
  }
  if (key.isDown(key.DOWN)) {
    gameState.player.y = gameState.player.y + (gameState.player.speed * dt);
  }

  if (key.isDown(key.SPACE) || mouse.isPressed()) {
    gameState.projectiles.push({
      x: (gameState.player.x + (gameState.player.height / 2)),
      y: gameState.player.y,
      width: 5,
      height: 5,
      speed: 200,
      color: 'yellow'
    })
  }

  // check bounds collisions
  if (gameState.player.x < 0) {
    gameState.player.x = canvas.width;
  } else if (gameState.player.x > canvas.width) {
    gameState.player.x = 0;
  }
  if (gameState.player.y < 0) {
    gameState.player.y = canvas.height;
  } else if (gameState.player.y > canvas.height) {
    gameState.player.y = 0;
  }

  // draw gameState.player
  ctx.fillStyle = gameState.player.color;
  ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);

  // draw gameState.projectiles.
  gameState.projectiles.forEach((projectile, idx) => {
    ctx.fillStyle = projectile.color;
    ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    // Move the projectile in 2d space todo add direction..
    // projectile.x = projectile.x - (projectile.speed * dt)
    projectile.y = projectile.y - (projectile.speed * dt)
    gameState.projectiles[idx] = projectile
  })

  // console.log('game update fn %s', dt);
});
