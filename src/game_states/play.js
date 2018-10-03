import GameState from "./base"
import { isLevelCleared, spaceShip, prevInput, currInput, switchState } from ".."
import Menu from "./menu"
import Preparing from "./preparing";
import End from "./end";

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class Play
 *
 * Represents the play mode of the game
 */
export default class Play extends GameState {

    /**
     * Constructs base play mode
     */
    constructor() {
        super()
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        if(isLevelCleared()) {
            switchState(new Preparing())
        }
    }

    /**
     * Handles the change in user input
     */
    handleInput() {
        if(!prevInput.shoot && currInput.shoot) {
            spaceShip.shoot()
        }

        if(currInput.left) {
            spaceShip.steerLeft()
        }

        if(currInput.right) {
            spaceShip.steerRight()
        }

        if(currInput.warp) {
            spaceShip.warp()
        }

        if(!prevInput.menu && currInput.menu) {
            switchState(new Menu(this))
        }
    }

    /**
     * Handles situation when spaceship gets destroyed
     */
    handleGameEnd() {
        switchState(new End())
    }
}