import SpaceShipState from './base'
import SpaceShipDead from './dead';
import SpaceShipWarping from './warping'
import SpaceShipInvincible from './invincible'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShipAlive
 *
 * Represents the default state of spaceship
 */
export default class SpaceShipAlive extends SpaceShipState {

    /**
     * Constructs default alive state
     *
     * @param {SpaceShip} spaceShip Reference to spaceship this state is attached to
     */
    constructor(spaceShip) {
        super(spaceShip)

        this.spaceShip.collidable = true
        this.spaceShip.flickers = false
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        if(this.spaceShip.warpCooldown > 0) {
            this.spaceShip.warpCooldown -= 1
        }
    }

    /**
     * Defines the behavior when spaceship is commanded to warp
     */
    warp() {
        if(this.spaceShip.warpCooldown == 0) {
            this.spaceShip.state = new SpaceShipWarping(this.spaceShip)
        }
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
        } else {
            this.spaceShip.state = new SpaceShipDead(this.spaceShip)
        }
    }
}