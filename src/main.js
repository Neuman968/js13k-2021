var loop = require('./loop');
var rand = require('./rand');
var key = require('./key');
var mouse = require('./mouse');
const enemyFactory = require('./entities/enemyFactory')
const globals = require('./globals')

var canvas = document.createElement('canvas');
canvas.width = globals.CANVAS_WIDTH;
canvas.height = globals.CANVAS_HEIGHT;
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
        width: 35,
        height: 30,
        speed: 250,
        color: 'rgba(236, 94, 103, 1)',
        projectileFiredSince: globals.PROJECTILE_DBOUNCE_SEC,
        health: 100,
        damaged: 0.001,
    },
    level: 1,
    playerProjectiles: [],
    enemies: [],
    enemyProjectiles: [],
}

const isProjectileFireable = (dt, firedSince) => (firedSince) >= globals.PROJECTILE_DBOUNCE_SEC

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

    // draw enemies...
    // todo we should probably have an enemy generator of some sorts.
    if (enemyAssetLoaded) {
        gameState.enemies.forEach((enemy) => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height)
            enemy.onNextFrame(dt)
            gameState.enemyProjectiles.push(...enemy.getFiredProjectiles(dt))
        })
    }

    // fudge enemy into existance.
    if (gameState.enemies.length === 0) {
        gameState.enemies.push(enemyFactory.newEnemy(gameState.enemies.length, rand.int(globals.CANVAS_WIDTH), rand.int(globals.CANVAS_HEIGHT / 4)))
        gameState.enemies.push(enemyFactory.newEnemy(gameState.enemies.length, rand.int(globals.CANVAS_WIDTH / 2), rand.int(globals.CANVAS_HEIGHT / 4)))
    }

    // draw gameState.playerProjectiles.
    gameState.playerProjectiles.forEach((projectile, idx) => {
        ctx.fillStyle = projectile.color;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);

        // check for enemy collision.
        const hitIdxs = gameState.enemies.filter((enemy) => globals.isCollide(enemy, projectile))
            .map((en, idx) => idx)
        // Remove hit enemies.
        hitIdxs.forEach(idx => gameState.enemies.splice(idx, 1))

        projectile.y = projectile.y - (projectile.speed * dt)
        gameState.playerProjectiles[idx] = projectile
    })

    // draw enemy projectiles
    gameState.enemyProjectiles.forEach((projectile, idx) => {
        ctx.fillStyle = projectile.color;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);

        // check for player collision
        if (globals.isCollide(gameState.player, projectile)) {
            gameState.player.damaged = 0.001
        }

        // Move the projectile in 2d space todo add direction..
        // projectile.x = projectile.x - (projectile.speed * dt)
        projectile.y = projectile.y + (projectile.speed * dt)
        gameState.enemyProjectiles[idx] = projectile
    })

    // draw gameState.player
    if (loaded) {
        ctx.drawImage(image, gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height)
        // check for damage animation draw.
        if (gameState.player.damaged > 0.00) {
            ctx.fillStyle = 'red'
            ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height)
            gameState.player.damaged += dt
            if (gameState.player.damaged >= 0.25) {
                gameState.player.damaged = 0.00
            }
        }
    }

    gameState.player.projectileFiredSince = gameState.player.projectileFiredSince + dt;

});
