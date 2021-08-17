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
    }

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
}


const enemyFactory = {
    newEnemy: (id, x, y) => new Enemy(id, x, y),
}

module.exports = enemyFactory
