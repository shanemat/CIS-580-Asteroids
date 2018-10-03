import GameState from "./base"
import Play from "./play"
import Menu from "./menu"
import { createNextLevel, level, prevInput, currInput, switchState, spaceShip, score } from ".."
import { AnimatedText, TextPathNode } from "../animated_text"
import SpaceShipInvincible from "../spaceship_states/invincible"
import End from "./end"

// ---------------------------------------- Constants ------------------------------------------- //

/** Color of the text */
const TEXT_COLOR = 'white'

/** Alignment of text */
const TEXT_ALIGNMENT = 'center'

/** Font for the head items */
const HEAD_FONT = 'bold 72px Palatino'

/** Vertical position of head items */
const HEAD_Y = (window.innerHeight - 95) / 2

/** Font for the subhead items */
const SUB_FONT = 'bold 48px Palatino'

/** Vertical position of subhead items */
const SUB_Y = HEAD_Y + 72

/** Width of canvas */
const CANVAS_WIDTH = window.innerWidth - 20

/** Drift of text in the middle */
const DRIFT = CANVAS_WIDTH * 2 / 21

/** Offset to hide text from screen */
const OFFSET = CANVAS_WIDTH * 2 / 11

/** Point in the middle of the screen for head items */
const POINT_MIDDLE_LEFT = CANVAS_WIDTH * 8 / 21

/** Point in the middle of the screen */
const POINT_MIDDLE = CANVAS_WIDTH * 10 / 21

/** Point in the middle of the screen for subhead items */
const POINT_MIDDLE_RIGHT = CANVAS_WIDTH * 11 / 21

/** Time for the text to get to the middle of the screen */
const APPEARANCE_DELAY = 20

/** Delay for texts to drift in the middle of the screen */
const DRIFT_DELAY = 240

/** Time for the text to disappear from the middle of the screen */
const DISAPPEARANCE_DELAY = 20

/** Time required for text to appear, drift and disappear */
const TEXT_DURATION = APPEARANCE_DELAY + DRIFT_DELAY + DISAPPEARANCE_DELAY

/** Delay of score text (after level text) */
const SCORE_DELAY = 20

/** Delay of ready text (after score disappearing) */
const READY_DELAY = SCORE_DELAY + TEXT_DURATION

/** Time of the end of this animation */
const FINAL_TIME = READY_DELAY + TEXT_DURATION

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class Preparing
 *
 * Represents the state, when next level is preparing
 */
export default class Preparing extends GameState {

    /**
     * Constructs base play mode
     */
    constructor() {
        super()

        this.timer = FINAL_TIME
        this.texts = prepareTexts()
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        this.texts.forEach((text) => {
            text.act()
        })

        if(this.timer > 0) {
            this.timer -= 1
        } else {
            spaceShip.state = new SpaceShipInvincible(spaceShip)

            createNextLevel()
            switchState(new Play())
        }
    }

    /**
     * Renders the game world contents
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    render(elapsedTime, context) {
        super.render(elapsedTime, context)

        this.texts.forEach((text) => {
            text.render(context)
        })
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

// ------------------------------------------ Inner --------------------------------------------- //

/**
 * Prepares the texts, which should be shown
 */
function prepareTexts() {
    var levelText = new AnimatedText('LEVEL ' + (level + 1), HEAD_FONT, TEXT_COLOR, TEXT_ALIGNMENT, HEAD_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(POINT_MIDDLE_LEFT, APPEARANCE_DELAY),
        new TextPathNode(POINT_MIDDLE_LEFT + DRIFT, DRIFT_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    var scoreText = new AnimatedText('SCORE: ' + score, SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, SUB_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(-OFFSET, SCORE_DELAY),
        new TextPathNode(POINT_MIDDLE_RIGHT, APPEARANCE_DELAY),
        new TextPathNode(POINT_MIDDLE_RIGHT + DRIFT, DRIFT_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    var readyText = new AnimatedText('READY', HEAD_FONT, TEXT_COLOR, TEXT_ALIGNMENT, HEAD_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(-OFFSET, READY_DELAY),
        new TextPathNode(POINT_MIDDLE, APPEARANCE_DELAY),
        new TextPathNode(POINT_MIDDLE + DRIFT, DRIFT_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    return [levelText, scoreText, readyText]
}