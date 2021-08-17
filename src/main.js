var loop = require('./loop');
var rand = require('./rand');
var key = require('./key');
var mouse = require('./mouse');
const enemyFactory = require('./entities/enemyFactory')
// Debounce for player firing cannon.
const PROJECTILE_DBOUNCE_SEC = 0.20 // 1 20th of a second.

const CANVAS_WIDTH = 1400

const CANVAS_HEIGHT = 700;

var canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = '#000';
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

// Load player.
let loaded = false
let image = new Image()
image.src = "assets/ship.png"
image.onload = () => {
    loaded = true
}


// Load enemy..
let enemyAssetLoaded = false
let enemyImage = new Image()
enemyImage.src = "assets/enemy.png"
enemyImage.onload = () => {
    enemyAssetLoaded = true
}


/**
 * contains player object and list of all projectiles on board.
 */
const gameState = {
    player: {
        x: rand.int(canvas.width),
        y: rand.int(canvas.height),
        width: 60,
        height: 60,
        speed: 250,
        color: 'rgba(236, 94, 103, 1)',
        projectileFiredSince: PROJECTILE_DBOUNCE_SEC,
        health: 100,
    },
    level: 1,
    playerProjectiles: [],
    enemies: [],
    enemyProjectiles: [],
}

const isProjectileFireable = (dt, firedSince) => (firedSince) >= PROJECTILE_DBOUNCE_SEC

/**
 * Adds projectiles to game state.
 * @param gameState
 */
const doFireProjectile = (gameState) => {
    gameState.playerProjectiles.push({
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
        gameState.player.y = gameState.player.y - (gameState.player.speed * dt / 2);
    }
    if (key.isDown(key.DOWN)) {
        gameState.player.y = gameState.player.y + (gameState.player.speed * dt / 2);
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

    // draw enemies...
    // todo we should probably have an enemy generator of some sorts.
    if (enemyAssetLoaded) {
        gameState.enemies.forEach((enemy) => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height)
            if (enemy.movingLeft) {
                enemy.x = enemy.x - (285 * dt)
                if (enemy.x < 0) {
                    enemy.movingLeft = false
                }
            } else {
                enemy.x = enemy.x + (285 * dt)
                if (enemy.x >= (CANVAS_WIDTH - enemy.width)) {
                    enemy.movingLeft = true
                }
            }
            // enemy.y = enemy.y - (285 * dt)
        })
    }

    // fudge enemy into existance.
    if (gameState.enemies.length === 0) {
        gameState.enemies.push(enemyFactory.newEnemy(gameState.enemies.length, rand.int(CANVAS_WIDTH), rand.int(CANVAS_HEIGHT / 4)))
    }

    // draw gameState.playerProjectiles.
    gameState.playerProjectiles.forEach((projectile, idx) => {
        ctx.fillStyle = projectile.color;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        // Move the projectile in 2d space todo add direction..
        // projectile.x = projectile.x - (projectile.speed * dt)
        projectile.y = projectile.y - (projectile.speed * dt)
        gameState.playerProjectiles[idx] = projectile
    })

    gameState.player.projectileFiredSince = gameState.player.projectileFiredSince + dt;

});
