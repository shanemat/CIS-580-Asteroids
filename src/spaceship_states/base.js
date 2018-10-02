import SpaceShip from '../objects/spaceship'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class SpaceShipState
 *
 * Represents state of FSM of SpaceShip
 */
export default class SpaceShipState {

    /**
     * Constructs base state
     *
     * @param {SpaceShip} spaceShip Reference to spaceship this state is attached to
     */
    constructor(spaceShip) {
        this.spaceShip = spaceShip
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'act\' function')
    }

    /**
     * Defines the behavior when spaceship is commanded to warp
     */
    warp() {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'warp\' function')
    }

    /**
     * Defines the behavior when spaceship collides with @param object
     * 
     * @param {GameObject} object Object which collided with spaceship
     */
    handleCollision(object) {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'handleCollision\' function')
    }

    /**
     * Renders additional assets associated with the state
     *
     * @param {CanvasRenderingContext2D} context Context to draw with 
     */
    render(context) {
        // intentionally left blank
    }
}
