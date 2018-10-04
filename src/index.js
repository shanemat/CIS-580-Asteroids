import Vector from './vector'
import { ObjectTypes } from './objects/game_object'
import { SpaceShip, SPACESHIP_WARP_COOLDOWN } from './objects/spaceship'
import Asteroid, { AsteroidNodes } from './objects/asteroid'
import UFO from './objects/ufo'
import Play from './game_states/play'
import Preparing from './game_states/preparing'

// ----------------------------------------------- Constants --------------------------------------------------- //

/** Color of background */
const BACKGROUND_COLOR = 'black'

/** Default font of canvas */
const CANVAS_FONT = 'bold 21px Palatino'

/** Height of border of display bar */
const CANVAS_DISPLAY_BORDER_HEIGHT = 5

/** Color of display bar border */
const CANVAS_DISPLAY_BORDER_COLOR = 'blue'

/** Height of complete display bar */
export const CANVAS_DISPLAY_BAR_HEIGHT = 70 + CANVAS_DISPLAY_BORDER_HEIGHT

/** Color of display bar */
const CANVAS_DISPLAY_BAR_COLOR = 'grey'

/** Text dimensions */
const CANVAS_TEXT_PADDING = 35
const CANVAS_TEXT_LINING = 25
const WARP_TEXT_WIDTH = 60

/** Canvas dimensions */
const CANVAS_PADDING = 50
const CANVAS_WARP_PADDING = -10

const CANVAS_WIDTH = window.innerWidth + 2 * CANVAS_WARP_PADDING
const CANVAS_HEIGHT = window.innerHeight + 2 * CANVAS_WARP_PADDING

/** Canvas layout content bounds */
export const CanvasBounds = {
    left: CANVAS_PADDING,
    right: CANVAS_WIDTH - CANVAS_PADDING,
    top: CANVAS_PADDING,
    bottom: CANVAS_HEIGHT - CANVAS_PADDING - CANVAS_DISPLAY_BAR_HEIGHT
}

/** Bounds for warping */
export const WarpBounds = {
    left: CANVAS_WARP_PADDING,
    right: CANVAS_WIDTH - CANVAS_WARP_PADDING,
    top: CANVAS_WARP_PADDING,
    bottom: CANVAS_HEIGHT - CANVAS_WARP_PADDING - CANVAS_DISPLAY_BAR_HEIGHT
}

/** Number of asteroids in first level */
const INIT_ASTEROID_COUNT = 3

/** Number of UFOs in first level */
const INIT_UFO_COUNT = 0

/** Number of asteroids added each level */
const ASTEROID_LEVEL_ADDITION = 1

/** Number of UFOs added each level */
const UFOS_LEVEL_ADDITION = 1 / 3

/** Number of nodes added to asteroids' upper limit */
const ASTEROID_NODE_LEVEL_ADDITION = 1 / 2

// ----------------------------------------------- Variables -------------------------------------------------- //

/** Input from previous cycle */
export var prevInput = {
    left: false,
    right: false,

    shoot: false,
    warp: false,

    menu: false,
    restart: false
}

/** Input from current cycle */
export var currInput = {
    left: false,
    right: false,

    shoot: false,
    warp: false,

    menu: false,
    restart: false
}

/** Initial time of game cycle */
var initialTime = null

/** The foreground canvas used for rendering */
var fgCanvas = createCanvas()
var fgcCtx = fgCanvas.getContext('2d')

/** The background canvas used for pre-computation */
var bgCanvas = createCanvas()
var bgcCtx = bgCanvas.getContext('2d')

/** Default font of game */
bgcCtx.font = CANVAS_FONT

/** Player-controlled spaceship */
export var spaceShip = new SpaceShip(new Vector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2))

/** Array of currently active bullets */
var bullets = []

/** Array of currently active asteroids */
var asteroids = []

/** Array of currently active UFOs */
var ufos = []

/** Currently allowed maximal number of asteroid nodes */
var maxAsteroidNodes = AsteroidNodes.min

/** Current score of player */
export var score = 0

/** Current level number */
export var level = 0

/** State the game is currently in */
export var state = new Play()

// ------------------------------------------------- Utils -------------------------------------------------- //

/**
 * @function clone
 *
 * Creates a deep copy of given object
 *
 * @param {any} object Object which deep copy should be created
 */
function clone(object) {
    return JSON.parse(JSON.stringify(object))
}

/**
 * Increases player score by given @param amount
 *
 * @param {Number} amount Amount of points to add to score
 */
function increaseScore(amount) {
    score += Math.floor(amount)
}

/**
 * Retrieves the current maximal asteroid size (in nodes)
 */
export function getMaxAsteroidSize() {
    return maxAsteroidNodes
}

/**
 * @function createCanvas
 *
 * Creates canvas with predetermined dimensions
 *
 * @returns Created canvas
 */
function createCanvas() {
    var canvas = document.createElement('canvas')

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    return canvas
}

/**
 * Calls given @param call function on all game objects
 *
 * @param {Function} call Function to be called on game objects. Can have parameters
 * of typical forEach ~ game object itself, its index and array itself
 */
export function iterateOverGameObjects(call) {
    bullets.forEach((bullet, index, array) => {
        call(bullet, index, array)
    })

    asteroids.forEach((asteroid, index, array) => {
        call(asteroid, index, array)
    })

    ufos.forEach((ufo, index, array) => {
        call(ufo, index, array)
    })

    call(spaceShip, 0, [spaceShip])
}

/**
 * Picks random location on game board
 *
 * @returns Random location on the game board
 */
export function pickRandomLocation() {
    var x = CanvasBounds.left + Math.random() * (CanvasBounds.right - CanvasBounds.left)
    var y = CanvasBounds.top + Math.random() * (CanvasBounds.bottom - CanvasBounds.top)

    return new Vector(x, y)
}

// ------------------------------------------------ Acting --------------------------------------------------- //

/**
 * Calls the @function act on all game objects
 */
export function actObjects() {
    iterateOverGameObjects((object) => {
        object.act()
    })
}

/**
 * Adds given game object to appropriate collection
 *
 * @param {GameObject} object Object to be spawned
 */
export function spawn(object) {
    switch(object.type) {
        case ObjectTypes.ASTEROID:
            asteroids.push(object)
            break

        case ObjectTypes.BULLET:
            bullets.push(object)
            break

        case ObjectTypes.UFO:
            ufos.push(object)
            break
    }
}

/**
 * Increments the level number and spawns appopriate number of enemies
 */
export function createNextLevel() {
    level += 1

    var asteroidCount = Math.floor(INIT_ASTEROID_COUNT + level * ASTEROID_LEVEL_ADDITION)
    var ufoCount = Math.floor(INIT_UFO_COUNT + level * UFOS_LEVEL_ADDITION)

    maxAsteroidNodes = Math.min(AsteroidNodes.max, Math.floor(AsteroidNodes.min + level * ASTEROID_NODE_LEVEL_ADDITION)) 

    for(var i = 0; i < asteroidCount; i++) {
        asteroids.push(new Asteroid())
    }
    
    for(var i = 0; i < ufoCount; i++) {
        ufos.push(new UFO())
    }
}

/**
 * Determines whether the current level has been cleared
 */
export function isLevelCleared() {
    return asteroids.length == 0 && ufos.length == 0
}

/**
 * Sets all game variables to their initial state
 */
export function restartGame() {
    spaceShip = new SpaceShip(new Vector(CANVAS_WIDTH/2, CANVAS_HEIGHT/2))

    level = 0
    score = 0

    asteroids = []
    bullets = []
    ufos = []

    state = new Preparing()
}

// ------------------------------------------------ Render --------------------------------------------------- //

/**
 * Renders information bar
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 */
function renderInfoBar(context) {
    var displayBarTop = CANVAS_HEIGHT - CANVAS_DISPLAY_BAR_HEIGHT
    renderBarBody(context, displayBarTop)

    context.fillStyle = 'black'
    renderScore(context, displayBarTop)
    renderLevel(context, displayBarTop)
    renderLives(context, displayBarTop)

    renderAsteroidInfo(context, displayBarTop)
    renderWarpInfo(context, displayBarTop)
    renderUFOInfo(context, displayBarTop)
}

/**
 * Renders the body of information bar
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderBarBody(context, top) {
    context.fillStyle = CANVAS_DISPLAY_BAR_COLOR
    context.fillRect(0, top, CANVAS_WIDTH, top + CANVAS_DISPLAY_BAR_HEIGHT)

    context.fillStyle = CANVAS_DISPLAY_BORDER_COLOR
    context.fillRect(0, top, CANVAS_WIDTH, CANVAS_DISPLAY_BORDER_HEIGHT)
}

/**
 * Renders player's score
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderScore(context, top) {
    context.textAlign = 'left'
    context.fillText('SCORE: ' + score, CANVAS_TEXT_PADDING, top + CANVAS_TEXT_PADDING)
}

/**
 * Renders the information about current level
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderLevel(context, top) {
    context.textAlign = 'center'
    context.fillText('LEVEL ' + level, CANVAS_WIDTH / 2, top + CANVAS_TEXT_PADDING)
}

/**
 * Renders the information about remaining lives
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderLives(context, top) {
    context.textAlign = 'right'
    context.fillText('LIVES: ' + spaceShip.lives, CANVAS_WIDTH - CANVAS_TEXT_PADDING, top + CANVAS_TEXT_PADDING)
}

/**
 * Renders the information about remaining asteroids
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderAsteroidInfo(context, top) {
    context.textAlign = 'left'
    context.fillText('Asteroids: ' + asteroids.length, CANVAS_TEXT_PADDING, top + CANVAS_TEXT_PADDING + CANVAS_TEXT_LINING)
}

/**
 * Renders the information about warp cooldown
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderWarpInfo(context, top) {
    context.save()

    if(spaceShip.warpCooldown == 0) {
        context.fillStyle = 'blue'
    }

    context.textAlign = 'center'
    context.fillText('WARP', CANVAS_WIDTH / 2, top + CANVAS_TEXT_PADDING + CANVAS_TEXT_LINING)

    var cooldownFraction = spaceShip.warpCooldown / SPACESHIP_WARP_COOLDOWN
    var remainingBlock = WARP_TEXT_WIDTH * cooldownFraction

    context.fillStyle = CANVAS_DISPLAY_BAR_COLOR
    context.fillRect(CANVAS_WIDTH / 2 + WARP_TEXT_WIDTH / 2 - remainingBlock, top + CANVAS_TEXT_PADDING + 5,
                        remainingBlock, CANVAS_TEXT_LINING)

    context.restore()
}

/**
 * Renders the information about remaining ufos
 *
 * @param {CanvasRenderingContext2D} context Context to draw with
 * @param {Number} top The top of information bar
 */
function renderUFOInfo(context, top) {
    context.textAlign = 'right'
    context.fillText('UFOs: ' + ufos.length, CANVAS_WIDTH - CANVAS_TEXT_PADDING, top + CANVAS_TEXT_PADDING + CANVAS_TEXT_LINING)
}

// ----------------------------------------------- Handlers -------------------------------------------------- //

/**
 * Handles events associated with key being pressed
 *
 * @param {KeyEvent} event The event to be handled
 */
function handleKeyDown(event) {
    event.preventDefault()
    switch(event.key) {
        case 's':
        case 'ArrowDown':
        case ' ':
            currInput.shoot = true
            break

        case 'a':
        case 'ArrowLeft':
            currInput.left = true
            break

        case 'd':
        case 'ArrowRight':
            currInput.right = true
            break

        case 'w':
        case 'ArrowUp':
            currInput.warp = true
            break

        case 'Escape':
            currInput.menu = true
            break

        case 'r':
            currInput.restart = true
            break
    }
}

/**
 * Handles events associated with key being released
 *
 * @param {KeyEvent} event The event to be handled
 */
function handleKeyUp(event) {
    event.preventDefault()
    switch(event.key) {
        case 's':
        case 'ArrowDown':
        case ' ':
            currInput.shoot = false
            break

        case 'a':
        case 'ArrowLeft':
            currInput.left = false
            break

        case 'd':
        case 'ArrowRight':
            currInput.right = false
            break

        case 'w':
        case 'ArrowUp':
            currInput.warp = false
            break

        case 'Escape':
            currInput.menu = false
            break

        case 'r':
            currInput.restart = false
            break
    }
}

/**
 * Handles the change in user input
 */
function handleInput() {
    state.handleInput()
}

/**
 * Call the border-crossing handler on all game objects outside the game board borders
 */
export function handleBorderCrossing() {
    iterateOverGameObjects((object) => {
        if(object.isOutsideBounds(WarpBounds)) {
            object.handleBorderCross(WarpBounds)
        }
    })
}

/**
 * Handles collision between game objects
 */
export function handleCollisions() {
    var objects = [spaceShip].concat(bullets).concat(asteroids).concat(ufos)

    for(var objectIndex = 0; objectIndex < objects.length; objectIndex++) {
        var object = objects[objectIndex]

        for(var otherIndex = objectIndex + 1; otherIndex < objects.length; otherIndex++) {
            var other = objects[otherIndex]

            if(object.collidesWith(other)) {
                object.handleCollision(other)

                if(object.type != ObjectTypes.ASTEROID || other.type != ObjectTypes.ASTEROID) {
                    other.handleCollision(object)
                }
            }

            if(object.toDispose) {
                break
            }
        }
    }
}

/**
 * Switches the state of the game
 *
 * @param {GameState} newState New state of the game
 */
export function switchState(newState) {
    state = newState
}

// ---------------------------------------------- Game Loop --------------------------------------------------- //

/**
 * Updates current states of game world
 *
 * @param {number} elapsedTime Time elapsed after last cycle
 */
function update(elapsedTime) {
    handleInput()
    state.update(elapsedTime)
}

/**
 * Renders the game world contents
 *
 * @param {number} elapsedTime Time elapsed after last cycle
 */
function render(elapsedTime) {
    bgcCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    bgcCtx.fillStyle = BACKGROUND_COLOR
    bgcCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    state.render(elapsedTime, bgcCtx)

    renderInfoBar(bgcCtx)

    fgcCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    fgcCtx.drawImage(bgCanvas, 0, 0)
}

/**
 * Removes all game objects marked for disposal from game
 */
function collectGarbage() {
    iterateOverGameObjects((object, index, array) => {
        if(object.toDispose) {
            array.splice(index, 1)
            increaseScore(object.score)
        }
    })
}

/**
 * The main game loop (everything that is actually done is done here :) )
 *
 * @param {DomHighResTimestamp} timestamp Current system time of moment when this function was called
 */
export function gameLoop(timestamp) {
    if(!initialTime) {
        initialTime = timestamp
    }

    var elapsedTime = timestamp - initialTime
    initialTime = timestamp

    state.act()

    update(elapsedTime)

    collectGarbage()

    render(elapsedTime)

    if(spaceShip.toDispose) {
        state.handleGameEnd()
    }

    prevInput = clone(currInput)
    window.requestAnimationFrame(gameLoop)
}

// ------------------------------------------------- Program --------------------------------------------------- //

document.body.appendChild(fgCanvas)

window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

window.requestAnimationFrame(gameLoop)
