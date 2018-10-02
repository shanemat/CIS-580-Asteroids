import SpaceShipState from './base'
import SpaceShipDead from './dead';
import SpaceShipInvincible from './invincible'
import { SPACESHIP_COLOR, SPACESHIP_WARPING_COLOR, 
        SPACESHIP_TIME_TO_WARP, SPACESHIP_WARP_COOLDOWN } from '../objects/spaceship';
import { pickRandomLocation } from '..';

// ---------------------------------------- Constants ------------------------------------------- //

/** Initial radius of warping portal */
const WARP_RADIUS_START = 1.0

/** Final radius of warping portal */
const WARP_RADIUS_END = 20.0

/** Width of portal ring */
const WARP_PORTAL_WIDTH = 5.0

/** Color of the warping portal */
const WARP_PORTAL_COLOR = 'blue'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShipWarping
 *
 * Represents the state when spaceship undergoes warping
 */
export default class SpaceShipWarping extends SpaceShipState {

    /**
     * Constructs warping state
     *
     * @param {SpaceShip} spaceShip Reference to spaceship this state is attached to
     */
    constructor(spaceShip) {
        super(spaceShip)

        this.spaceShip.color = SPACESHIP_WARPING_COLOR

        this.timer = SPACESHIP_TIME_TO_WARP
        this.cooldownStep = SPACESHIP_WARP_COOLDOWN / SPACESHIP_TIME_TO_WARP

        this.radius = WARP_RADIUS_START
        this.radiusStep = (WARP_RADIUS_END - WARP_RADIUS_START) / SPACESHIP_TIME_TO_WARP

        this.warpDestination = pickRandomLocation()
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        this.radius += this.radiusStep
        this.spaceShip.warpCooldown += this.cooldownStep

        if(this.timer > 0) {
            this.timer -= 1
        } else {
            this.spaceShip.location = this.warpDestination
            this.spaceShip.state = new SpaceShipInvincible(this.spaceShip)

            this.spaceShip.color = SPACESHIP_COLOR
            this.spaceShip.warpCooldown = SPACESHIP_WARP_COOLDOWN
        }
    }

    /**
     * Defines the behavior when spaceship is commanded to warp
     */
    warp() {
        // intentionally left blank
    }

    /**
     * Defines the behavior when spaceship collides with @param object
     *
     * @param {GameObject} object Object which collided with spaceship
     */
    handleCollision(object) {
        if(this.spaceShip.lives > 1) {
            this.spaceShip.lives -= 1
            this.spaceShip.state = new SpaceShipInvincible(this.spaceShip)

            this.spaceShip.color = SPACESHIP_COLOR
            this.spaceShip.warpCooldown = SPACESHIP_WARP_COOLDOWN
        } else {
            this.spaceShip.state = new SpaceShipDead(this.spaceShip)
        }
    }

    /**
     * Renders additional assets associated with the state
     *
     * @param {CanvasRenderingContext2D} context Context to draw with 
     */
    render(context) {
        context.save()

        context.beginPath()
        context.fillStyle = WARP_PORTAL_COLOR
        context.arc(this.warpDestination.x, this.warpDestination.y,
                this.radius, 0, 2 * Math.PI, true)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = 'black'
        context.arc(this.warpDestination.x, this.warpDestination.y,
                Math.max(0.0, this.radius - WARP_PORTAL_WIDTH), 0, 2 * Math.PI, true)
        context.fill()
        context.closePath()

        context.restore()
    }
}

