import SpaceShipState from "./base";

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShipDead
 *
 * Represents the state when spaceship is destroyed
 */
export default class SpaceShipDead extends SpaceShipState {

    /**
     * Constructs state when spaceship is destroyed
     *
     * @param {SpaceShip} spaceShip Reference to spaceship this state is attached to
     */
    constructor(spaceShip) {
        super(spaceShip)

        this.spaceShip.toDispose = true
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        // intentionally left blank
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
        // intentionally left blank
    }
}