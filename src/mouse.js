var _pressed = false;
var mouse = {};

mouse.isPressed = () => {
    return _pressed
}

mouse.onPress = (e, pressed) => {
    _pressed = pressed
}

window.addEventListener('mousedown', (e) => {
    mouse.onPress(e, true)
})

window.addEventListener('mouseup', (e) => {
    mouse.onPress(e, false)
})

module.exports = mouse;
