import { iterateOverGameObjects, actObjects, handleCollisions, handleBorderCrossing, switchState } from ".."

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class GameState
 *
 * Represents the abstract game state
 */
export default class GameState {

    /**
     * Constructs base game state
     */
    constructor() {
        // intentionally left blank
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'act\' function')
    }

    /**
     * Renders the game world contents
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    render(elapsedTime, context) {
        iterateOverGameObjects((object) => {
            object.render(context)
        })
    }

    /**
     * Updates current states of game world
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    update(elapsedTime) {
        actObjects()
        handleBorderCrossing()
        handleCollisions()
    }

    /**
     * Handles the change in user input
     */
    handleInput() {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'handleInput\' function')
    }

    /**
     * Handles situation when spaceship gets destroyed
     */
    handleGameEnd() {
        throw new TypeError('State ' + this.constructor.name + ' should override the \'handleGameEnd\' function')
    }
}