import Vector from '../vector'
import { GameObject, ObjectTypes } from './game_object'

// ---------------------------------------- Constants ------------------------------------------- //

/** Initial speed of bullet */
const BULLET_SPEED = 12.0

/** The shape of bullet */
const BULLET_SHAPE = [
    new Vector(2.0, 2.0),
    new Vector(-2.0, 2.0),
    new Vector(-2.0, -2.0),
    new Vector(2.0, -2.0)
]

/** Default color of the bullet */
const BULLET_COLOR = 'yellow'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class Bullet
 *
 * Represents fired bullet on the game board
 */
export default class Bullet extends GameObject {

    /**
     * Contructs base bullet
     *
     * @param {Vector} location Location to spawn bullet on
     * @param {Vector} velocity Base velocity vector of this bullet
     */
    constructor(location, velocity) {
        super(location, Vector.multiply(Vector.normalize(velocity), BULLET_SPEED), 
            Vector.copyArray(BULLET_SHAPE), BULLET_COLOR, ObjectTypes.BULLET, 0)
    }

    /**
     * Handles situation, when game object leaves the bounds of game board
     *
     * @param {Dictionary} bounds Dictionary containing canvas warping bounds
     */
    handleBorderCross(_) {
        this.toDispose = true
    }

    /**
     * Handles the collision with other game object
     *
     * @param {GameObject} other Game object this game object collided with
     */
    handleCollision(other) {
        if(other.type != ObjectTypes.BULLET) {
            this.toDispose = true
        }
    }
}