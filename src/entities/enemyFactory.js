
class Enemy {

    constructor(id, x, y, movingLeft = true) {
        this.id = id
        this.health = 100;
        this.x = x
        this.y = y
        this.height = 60
        this.width = 60
        this.movingLeft = movingLeft
    }
}


const enemyFactory = {
    newEnemy: (id, x, y) => new Enemy(id, x, y),
}

module.exports = enemyFactory
