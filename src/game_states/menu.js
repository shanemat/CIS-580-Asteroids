import GameState from "./base"
import { prevInput, currInput, switchState } from ".."

// ---------------------------------------- Constants ------------------------------------------- //

/** Width of canvas */
const CANVAS_WIDTH = window.innerWidth - 20

/** Default font of menu */
const MENU_FONT = '21px Palatino'

/** Default lining of menu */
const MENU_LINING = 25

/** Header font of menu */
const MENU_HEADER_FONT = 'bold 38px Palatino'

/** Header lining of menu */
const MENU_HEADER_LINING = 40

/** Font of menu title */
const MENU_TITLE_FONT = 'bold 72px Palatino'

/** Title of menu */
const MENU_TITLE = 'HELP'

/** Font of the credits */
const CREDITS_FONT = '21px Palation'

/** Padding of the credits text */
const CREDITS_PADDING = 24

/** Position of the credits text */
const CREDITS_POSITION = window.innerHeight - 75 - CREDITS_PADDING

/** Alignment of the credits text */
const CREDITS_ALIGNMENT = 'left'

/** Color of text in menu */
const MENU_TEXT_COLOR = 'white'

/** Padding of menu */
const MENU_PADDING = 50

/** Offset of menu content */
const MENU_CONTENT_OFFSET = 150

/** Content of menu */
const MenuContent = [
    {text: 'Controls:',                                                     font: MENU_HEADER_FONT, lining: MENU_HEADER_LINING},
    {text: '      * turn left:       A,      LEFT',                         font: MENU_FONT, lining: MENU_LINING},
    {text: '      * turn right:     D,      RIGHT',                         font: MENU_FONT, lining: MENU_LINING},
    {text: '      * shoot:           S,       DOWN,    SPACE',              font: MENU_FONT, lining: MENU_LINING},
    {text: '      * warp:            W,     UP',                            font: MENU_FONT, lining: MENU_LINING},
    {text: '      * menu:           ESC',                                   font: MENU_FONT, lining: MENU_LINING},
    {text: '',                                                              font: MENU_FONT, lining: MENU_LINING},
    {text: 'Gameplay:',                                                     font: MENU_HEADER_FONT, lining: MENU_HEADER_LINING},
    {text: '      * do not die (you have 3 lives)',                         font: MENU_FONT, lining: MENU_LINING},
    {text: '      * destroy all enemies (asteroids and UFOs)',              font: MENU_FONT, lining: MENU_LINING},
    {text: '      * once everything is destroyed, new level will begin',    font: MENU_FONT, lining: MENU_LINING},
    {text: '',                                                              font: MENU_FONT, lining: MENU_LINING},
    {text: 'Mechanics:',                                                    font: MENU_HEADER_FONT, lining: MENU_HEADER_LINING},
    {text: '      * the spaceship flies forwards with constant speed',      font: MENU_FONT, lining: MENU_LINING},
    {text: '      * warp can be only used, when it\'s ready (indicator)',   font: MENU_FONT, lining: MENU_LINING},
    {text: '      * if you are hit during warping, it gets cancelled',      font: MENU_FONT, lining: MENU_LINING},
    {text: '      * if the spaceship is flashing, you are invincible',      font: MENU_FONT, lining: MENU_LINING},
]

/**
 * Content of game credits
 */
const Credits = [
    'Credits:',
    ' * Animated text idea ~ https://github.com/RealJohnSmith',
    ' * Sound effects ~ https://www.soundboard.com/sb/sound/252002, http://www.freesfx.co.uk, http://soundbible.com/'
]

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class Menu
 *
 * Represents the state when game is paused and menu is shown
 */
export default class Menu extends GameState {

    /**
     * Constructs base menu state
     *
     * @param {GameState} prevState Previous game state
     */
    constructor(prevState) {
        super()

        this.prevState = prevState
    }

    /**
     * Procs timer on the state (called each game cycle)
     */
    act() {
        // intentionally left blank
    }

    /**
     * Renders the game world contents
     *
     * @param {number} elapsedTime Time elapsed after last cycle
     */
    render(elapsedTime, context) {
        context.save()
        context.fillStyle = MENU_TEXT_COLOR

        context.textAlign = 'center'
        context.font = MENU_TITLE_FONT
        context.fillText(MENU_TITLE, CANVAS_WIDTH / 2, MENU_PADDING + MENU_LINING)

        context.textAlign = 'left'
        var lineStart = MENU_CONTENT_OFFSET

        MenuContent.forEach((line) => {
            context.font = line.font
            context.fillText(line.text, CANVAS_WIDTH / 3, lineStart)
            lineStart += line.lining
        })

        context.font = CREDITS_FONT
        context.textAlign = CREDITS_ALIGNMENT
        Credits.forEach((text, index) => {
            context.fillText(text, CREDITS_PADDING, CREDITS_POSITION - (3 - index) * CREDITS_PADDING)
        })

        context.restore()
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
     * Handles the change in user input
     */
    handleInput() {
        if(!prevInput.menu && currInput.menu) {
            switchState(this.prevState)
        }
    }

    /**
     * Handles situation when spaceship gets destroyed
     */
    handleGameEnd() {
        // intentionally left blank
    }
}