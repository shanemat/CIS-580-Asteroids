import { spawn } from '..'
import { GameObject, ObjectTypes } from './game_object'
import Vector from '../vector'
import Bullet from './bullet'
import SpaceShipAlive from '../spaceship_states/alive'

// ---------------------------------------- Constants ------------------------------------------- //

/** Initial speed of spaceship */
const SPACESHIP_SPEED = 4.0

/** Initial direction of spaceship */
const SPACESHIP_DIRECTION = new Vector(0.0, 1.0)

/** The shape of spaceship */
const SPACESHIP_SHAPE = [
    new Vector(0.0, 15.0),
    new Vector(10.0, -5.0),
    new Vector(10.0, -15.0),
    new Vector(0.0, -5.0),
    new Vector(-10.0, -15.0),
    new Vector(-10.0, -5.0)
]

/** Default color of the spaceship */
export const SPACESHIP_COLOR = 'red'

/** Color of spaceship while warping */
export const SPACESHIP_WARPING_COLOR = 'blue'

/** Time required for spaceship to warp */
export const SPACESHIP_INVINCIBLE_DURATION = 180

/** Time required for spaceship to warp */
export const SPACESHIP_TIME_TO_WARP = 120

/** Cooldown before warping */
export const SPACESHIP_WARP_COOLDOWN = 600

/** Base number of lives of spaceship */
const SPACESHIP_LIVES = 3

/** Steering factor of spaceship - currently 2° */
const SPACESHIP_STEERING_ANGLE = Math.PI / 90.0

/** Multiplier of velocity vector for bullet spawn */
const SPACESHIP_BULLET_SPAWN_MULT = 1.2

/** Path to spaceship explosion sound effect */
const SPACESHIP_EXPLOSION_SFX = './sfx/mayday.wav'

/** Path to warping sound effect */
const SPACESHIP_WARP_SFX = './sfx/warp.wav'

/** Path to bullet being fired sound effect */
const BULLET_SFX = './sfx/laser.wav'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShip
 *
 * Represents player-controlled spaceship
 */
export class SpaceShip extends GameObject {

    /**
     * Contructs base spaceship
     *
     * @param {Vector} location Location to spawn spaceship on
     */
    constructor(location) {
        super(location, Vector.multiply(SPACESHIP_DIRECTION, SPACESHIP_SPEED),
                Vector.copyArray(SPACESHIP_SHAPE), SPACESHIP_COLOR, ObjectTypes.SPACESHIP, 0)

        this.lives = SPACESHIP_LIVES
        this.warpCooldown = SPACESHIP_WARP_COOLDOWN

        this.state = new SpaceShipAlive(this)
    }

    /**
     * Steers the spaceship to the left
     */
    steerLeft() {
        steer(this, -SPACESHIP_STEERING_ANGLE)
    }

    /**
     * Steers the spaceship to the right
     */
    steerRight() {
        steer(this, SPACESHIP_STEERING_ANGLE)
    }

    /**
     * Shoots a bullet from the front of this spaceship
     */
    shoot() {
        var position = Vector.add(this.location, Vector.multiply(this.shape[0], SPACESHIP_BULLET_SPAWN_MULT))
        spawn(new Bullet(position, this.velocity))
        new Audio(BULLET_SFX).play()
    }

    /**
     * Starts warping process
     */
    warp() {
        this.state.warp()
        new Audio(SPACESHIP_WARP_SFX).play()
    }

    /**
     * Simulates the behavior of this spaceship during one frame
     */
    act() {
        super.act()
        this.state.act()
    }

    /**
     * Handles situation, when game object leaves the bounds of game board
     *
     * @param {Dictionary} bounds Dictionary containing canvas warping bounds
     */
    handleBorderCross(bounds) {
        this.warpBack(bounds)
    }

    /**
     * Handles the collision with other game object
     *
     * @param {GameObject} other Game object this game object collided with
     */
    handleCollision(other) {
        this.state.handleCollision(other)
        new Audio(SPACESHIP_EXPLOSION_SFX).play()
    }

    /**
     * Renders this game object using given @param context
     *
     * @param {CanvasRenderingContext2D} context Context to draw with
     */
    render(context) {
        super.render(context)
        this.state.render(context)
    }
}

// ------------------------------------------ Inner --------------------------------------------- //

/**
 * Steers @param spaceship by given @param angle
 *
 * @param {SpaceShip} spaceship Spaceship to be steered
 */
function steer(spaceship, angle) {
    spaceship.velocity.rotate(angle)
    spaceship.rotate(angle)
}