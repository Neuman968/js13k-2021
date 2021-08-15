var loop = require('./loop');
var rand = require('./rand');
var key = require('./key');
var mouse = require('./mouse');

// Debounce for player firing cannon.
const PROJECTILE_DBOUNCE_SEC = 0.20 // 1 20th of a second.

var canvas = document.createElement('canvas');
canvas.width = 1400;
canvas.height = 700;
canvas.style.backgroundColor = '#000';
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

let loaded = false
let image = new Image()
image.src = "ship.png"
image.onload = () => { loaded = true }

/**
 * contains player object and list of all projectiles on board.
 */
const gameState = {
  player: {
    x: rand.int(canvas.width),
    y: rand.int(canvas.height),
    width: 50,
    height: 50,
    speed: 250,
    color: 'rgba(236, 94, 103, 1)',
    projectileFiredSince: PROJECTILE_DBOUNCE_SEC,
  },
  projectiles: [],
  enemies: [],
}

const isProjectileFireable = (dt, firedSince) => (firedSince) >= PROJECTILE_DBOUNCE_SEC

/**
 * Adds projectiles to game state.
 * @param gameState
 */
const doFireProjectile = (gameState) => {
  gameState.projectiles.push({
    x: (gameState.player.x + (gameState.player.height / 2)),
    y: gameState.player.y,
    width: 5,
    height: 5,
    speed: 350,
    color: 'yellow'
  })
  gameState.player.projectileFiredSince = 0.0
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

  // fire projectile.
  if ((key.isDown(key.SPACE) || mouse.isPressed()) && isProjectileFireable(dt, gameState.player.projectileFiredSince)) {
    doFireProjectile(gameState)
  }

  // check bounds collisions
  if (gameState.player.x < 0) {
    gameState.player.x = canvas.width;
  } else if (gameState.player.x > canvas.width) {
    gameState.player.x = 0;
  }

  // outer bounds check.
  if (gameState.player.y < 0) {
    gameState.player.y = canvas.height;
  } else if (gameState.player.y > canvas.height) {
    gameState.player.y = 0;
  }

  // draw gameState.player
  if (loaded) {
    ctx.drawImage(image, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height)
  }

  // draw gameState.projectiles.
  gameState.projectiles.forEach((projectile, idx) => {
    ctx.fillStyle = projectile.color;
    ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    // Move the projectile in 2d space todo add direction..
    // projectile.x = projectile.x - (projectile.speed * dt)
    projectile.y = projectile.y - (projectile.speed * dt)
    gameState.projectiles[idx] = projectile
  })

  gameState.player.projectileFiredSince = gameState.player.projectileFiredSince + dt;

});
