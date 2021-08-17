const globals = require('../globals.js')

class Enemy {

    constructor(id, x, y, speed = 270, movingLeft = true) {
        this.id = id
        this.health = 100;
        this.x = x
        this.y = y
        this.height = 60
        this.width = 60
        this.speed = speed
        this.movingLeft = movingLeft
        this.projectileFiredSince = globals.PROJECTILE_DBOUNCE_SEC
    }

    /**
     * Updates the current entity based on new frame.
     * @param dt (Delta Time)
     */
    onNextFrame(dt) {
        if (this.movingLeft) {
            this.x = this.x - (this.speed * dt)
            if (this.x < 0) {
                this.movingLeft = false
            }
        } else {
            this.x = this.x + (this.speed * dt)
            if (this.x >= (globals.CANVAS_WIDTH - this.width)) {
                this.movingLeft = true
            }
        }
    }

    /**
     * Returns an array of projectiles fired.
     * @param dt
     */
    getFiredProjectiles(dt) {
        if (globals.isProjectileFireable(dt, this.projectileFiredSince)) {
            this.projectileFiredSince = 0.0
            return [{
                x: (this.x + (this.height / 2)),
                y: this.y + (this.width / 2),
                width: 5,
                height: 5,
                speed: 350,
                color: 'red',
            }]
        } else {
            this.projectileFiredSince = this.projectileFiredSince + dt;
        }
        return []
    }

}


const enemyFactory = {
    newEnemy: (id, x, y) => new Enemy(id, x, y),
}

module.exports = enemyFactory
