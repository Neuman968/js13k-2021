const globals = {
    CANVAS_WIDTH: 1400,
    CANVAS_HEIGHT: 700,
    PROJECTILE_DBOUNCE_SEC: 0.20,
    // todo 0.20 is debounce...
    isProjectileFireable: (dt, firedSince) => (firedSince) >= 0.20
}

module.exports = globals
