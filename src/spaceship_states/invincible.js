import SpaceShipState from './base'
import SpaceShipAlive from './alive'
import SpaceShipWarping from './warping';
import { SPACESHIP_INVINCIBLE_DURATION } from '../objects/spaceship';

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShipInvincible
 *
 * Represents the state when spaceship is invincible
 */
export default class SpaceShipInvincible extends SpaceShipState {

    /**
     * Constructs invincible state
     *
     * @param {SpaceShip} spaceShip Reference to spaceship this state is attached to
     */
    constructor(spaceShip) {
        super(spaceShip)

        this.timer = SPACESHIP_INVINCIBLE_DURATION

        this.spaceShip.collidable = false
        this.spaceShip.flickers = true
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        if(this.spaceShip.warpCooldown > 0) {
            this.spaceShip.warpCooldown -= 1
        }

        if(this.timer > 0) {
            this.timer -= 1
        } else {
            this.spaceShip.state = new SpaceShipAlive(this.spaceShip)
        }
    }

    /**
     * Defines the behavior when spaceship is commanded to warp
     */
    warp() {
        if(this.spaceShip.warpCooldown > 0) {
            this.spaceShip.warpCooldown -= 1
        } else {
            this.spaceShip.state = new SpaceShipWarping(this.spaceShip)
        }
    }

    /**
     * Defines the behavior when spaceship collides with @param object
     *
     * @param {GameObject} object Object which collided with spaceship
     */
    handleCollision(object) {
        // intentionally left blank
    }
}