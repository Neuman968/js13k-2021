const globals = {
    CANVAS_WIDTH: 1400,
    CANVAS_HEIGHT: 700,
    PROJECTILE_DBOUNCE_SEC: 0.20,
    // todo 0.20 is debounce...
    isProjectileFireable: (dt, firedSince) => (firedSince) >= 0.20,
    isCollide: (a, b) => !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        ),
}

module.exports = globals
