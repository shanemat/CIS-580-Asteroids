import GameState from "./base"
import { currInput, prevInput, restartGame, switchState, level, score } from ".."
import Menu from "./menu"
import { AnimatedText, TextPathNode } from "../animated_text"

// ---------------------------------------- Constants ------------------------------------------- //

/** Color of the text */
const TEXT_COLOR = 'white'

/** Alignment of text */
const TEXT_ALIGNMENT = 'center'

/** Font for the head items */
const HEAD_FONT = 'bold 72px Palatino'

/** Lining after head font */
const HEAD_LINING = 150

/** Vertical position of head items */
const HEAD_Y = (window.innerHeight - 95) / 4

/** Font for the subhead items */
const SUB_FONT = 'bold 32px Palatino'

/** Lining after sub font */
const SUB_LINING = 32

/** Vertical position of level text */
const LEVEL_Y = HEAD_Y + HEAD_LINING 

/** Vertical position of score text */
const SCORE_Y = LEVEL_Y + SUB_LINING

/** Vertical position of restart text */
const RESTART_Y = SCORE_Y + HEAD_LINING

/** Width of canvas */
const CANVAS_WIDTH = window.innerWidth - 20

/** Offset to hide text from screen */
const OFFSET = CANVAS_WIDTH * 4 / 11

/** Point in the middle of the screen */
const POINT_MIDDLE = CANVAS_WIDTH * 10 / 21

/** Point in the middle of the screen for subhead items */
const POINT_MIDDLE_RIGHT = CANVAS_WIDTH * 11 / 21

/** Time for the text to get to the middle of the screen */
const APPEARANCE_DELAY = 20

/** Time for the text to disappear from the middle of the screen */
const DISAPPEARANCE_DELAY = 20

/** Delay of level text (after game over text) */
const LEVEL_DELAY = 60

/** Delay of score text (after score text) */
const SCORE_DELAY = LEVEL_DELAY + 20

/** Delay of level text (after level text) */
const RESTART_DELAY = SCORE_DELAY + 60

/** Delay of between text fly off */
const FLY_OFF_DELAY = 10

/** Final time of text appearance */
const APPEARANCE_TIME = RESTART_DELAY + APPEARANCE_DELAY + 10

/** Final time of text fly-off */
const DISAPPEARANCE_TIME = 3 * FLY_OFF_DELAY + DISAPPEARANCE_DELAY

// ------------------------------------------ Class --------------------------------------------- //

export default class End extends GameState {

        /**
     * Constructs base play mode
     */
    constructor() {
        super()

        this.preTexts = preparePreTexts()
        this.postTexts = preparePostTexts()

        this.timer = APPEARANCE_TIME + DISAPPEARANCE_TIME
        this.halfTime = DISAPPEARANCE_TIME
        this.shouldRestart = false
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        if(this.timer > this.halfTime || this.shouldRestart) {
            this.timer -= 1
        }

        if(this.timer > this.halfTime) {
            this.preTexts.forEach((text) => {
                text.act()
            })
        } else if(this.shouldRestart) {
            this.postTexts.forEach((text) => {
                text.act()
            })
        }

        if(this.timer == 0) {
            restartGame()
        }
    }

    /**
     * Updates current states of game world
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    update(elapsedTime) {
        // intentionally left blank
    }

    /**
     * Renders the game world contents
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    render(elapsedTime, context) {
        if(this.timer >= this.halfTime) {
            this.preTexts.forEach((text) => {
                text.render(context)
            })
        } else if(this.shouldRestart) {
            this.postTexts.forEach((text) => {
                text.render(context)
            })
        }
    }

    /**
     * Handles the change in user input
     */
    handleInput() {
        if(!prevInput.menu && currInput.menu) {
            switchState(new Menu(this))
        }

        if(this.timer == this.halfTime && currInput.restart) {
            this.shouldRestart = true
        }
    }

    /**
     * Handles situation when spaceship gets destroyed
     */
    handleGameEnd() {
        // intentionally left blank
    }
}

// ------------------------------------------ Inner --------------------------------------------- //

/**
 * Prepares the animation of text to get them on the screen
 *
 * @returns Array of prepared AnimatedTexts
 */
function preparePreTexts() {
    var gameOverText = new AnimatedText('GAME OVER', HEAD_FONT, TEXT_COLOR, TEXT_ALIGNMENT, HEAD_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(POINT_MIDDLE, APPEARANCE_DELAY)
    ])

    var levelText = new AnimatedText('LEVEL: ' + level, SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, LEVEL_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(-OFFSET, LEVEL_DELAY),
        new TextPathNode(POINT_MIDDLE_RIGHT, APPEARANCE_DELAY)
    ])

    var scoreText = new AnimatedText('SCORE: ' + score, SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, SCORE_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(-OFFSET, SCORE_DELAY),
        new TextPathNode(POINT_MIDDLE_RIGHT, APPEARANCE_DELAY)
    ])

    var restartText = new AnimatedText('To restart game press \'R\'!', SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, RESTART_Y, [
        new TextPathNode(-OFFSET, 0),
        new TextPathNode(-OFFSET, RESTART_DELAY),
        new TextPathNode(POINT_MIDDLE_RIGHT, APPEARANCE_DELAY)
    ])

    return [gameOverText, levelText, scoreText, restartText]
}

/**
 * Prepares the animation of text to get them off the screen
 *
 * @returns Array of prepared AnimatedTexts
 */
function preparePostTexts() {
    var gameOverText = new AnimatedText('GAME OVER', HEAD_FONT, TEXT_COLOR, TEXT_ALIGNMENT, HEAD_Y, [
        new TextPathNode(POINT_MIDDLE, 0),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    var levelText = new AnimatedText('LEVEL: ' + level, SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, LEVEL_Y, [
        new TextPathNode(POINT_MIDDLE_RIGHT, 0),
        new TextPathNode(POINT_MIDDLE_RIGHT, FLY_OFF_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    var scoreText = new AnimatedText('SCORE: ' + score, SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, SCORE_Y, [
        new TextPathNode(POINT_MIDDLE_RIGHT, 0),
        new TextPathNode(POINT_MIDDLE_RIGHT, 2 * FLY_OFF_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    var restartText = new AnimatedText('To restart game press \'R\'!', SUB_FONT, TEXT_COLOR, TEXT_ALIGNMENT, RESTART_Y, [
        new TextPathNode(POINT_MIDDLE_RIGHT, 0),
        new TextPathNode(POINT_MIDDLE_RIGHT, 3 * FLY_OFF_DELAY),
        new TextPathNode(CANVAS_WIDTH + OFFSET, DISAPPEARANCE_DELAY)
    ])

    return [gameOverText, levelText, scoreText, restartText]
}