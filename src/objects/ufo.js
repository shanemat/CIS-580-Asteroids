import { GameObject, ObjectTypes } from "./game_object"
import Vector from '../vector'
import { pickRandomLocation, spaceShip, spawn } from ".."
import Bullet from "./bullet";

// ---------------------------------------- Constants ------------------------------------------- //

/** Initial speed of UFO */
const UFO_SPEED = 2.5

/** Number of frames before UFO can react again */
const UFO_REACTION_TIME = 40

/** Score awarded for destroying UFO */
const UFO_SCORE = 1000

/** Multiplier of velocity vector for bullet spawn */
const UFO_BULLET_SPAWN_MULT = 5.0

/** Color of UFO's inner shape */
const UFO_INNER_COLOR = 'white'

/** Sizes of UFO rings */
const UFOSize = {
    inner: 2.5,
    outer: 7.5
}

/** The inner shape of UFO */
const UFO_INNER_SHAPE = [
    new Vector(UFOSize.inner, -2 * UFOSize.inner),
    new Vector(2 * UFOSize.inner, -UFOSize.inner),
    new Vector(2 * UFOSize.inner, UFOSize.inner),
    new Vector(UFOSize.inner, 2 * UFOSize.inner),
    new Vector(-UFOSize.inner, 2 * UFOSize.inner),
    new Vector(-2 * UFOSize.inner, UFOSize.inner),
    new Vector(-2 * UFOSize.inner, -UFOSize.inner),
    new Vector(-UFOSize.inner, -2 * UFOSize.inner)
]

/** Color of UFO's outer shape */
const UFO_OUTER_COLOR = 'yellow'

/** The outer shape of UFO */
const UFO_OUTER_SHAPE = [
    new Vector(UFOSize.outer, -2 * UFOSize.outer),
    new Vector(2 * UFOSize.outer, -UFOSize.outer),
    new Vector(2 * UFOSize.outer, UFOSize.outer),
    new Vector(UFOSize.outer, 2 * UFOSize.outer),
    new Vector(-UFOSize.outer, 2 * UFOSize.outer),
    new Vector(-2 * UFOSize.outer, UFOSize.outer),
    new Vector(-2 * UFOSize.outer, -UFOSize.outer),
    new Vector(-UFOSize.outer, -2 * UFOSize.outer)
]

/** Path to UFO explosion sound effect */
const UFO_EXPLOSION_SFX = './sfx/explosion.wav'

/** Path to bullet being fired sound effect */
const BULLET_SFX = './sfx/laser.wav'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class UFO
 *
 * Represents enemy fighter trying to shoot down player spaceship
 */
export default class UFO extends GameObject {

    /**
     * Constructs base UFO
     *
     * @param {Vector} location Starting location of this UFO
     * @param {Vector} velocity Base velocity of this UFO
     */
    constructor(location, velocity) {
        super(location, velocity, Vector.copyArray(UFO_OUTER_SHAPE),
            UFO_OUTER_COLOR, ObjectTypes.UFO, UFO_SCORE)

        if(!location) {
            this.location = pickRandomLocation()
        }

        if(!velocity) {
            this.velocity = Vector.random()
            this.velocity.multiply(UFO_SPEED)
        }

        this.innerShape = Vector.copyArray(UFO_INNER_SHAPE)
        this.reactionTimer = UFO_REACTION_TIME
    }

    /**
     * Simulates the behavior of this spaceship during one frame
     */
    act() {
        super.act()

        if(this.reactionTimer > 0) {
            this.reactionTimer -= 1
        } else {
            var wayToPlayer = Vector.subtract(spaceShip.location, this.location)
            wayToPlayer.normalize()

            this.velocity = Vector.multiply(wayToPlayer, UFO_SPEED)
            this.shoot(wayToPlayer)

            this.reactionTimer = UFO_REACTION_TIME
        }
    }

    /**
     * Shoots a bullet after player spaceship
     *
     * @param {Vector} wayToPlayer Vector to player spaceship
     */
    shoot(wayToPlayer) {
        var bulletWay = Vector.multiply(wayToPlayer, UFOSize.outer * UFO_BULLET_SPAWN_MULT)
        var bulletLocation = Vector.add(this.location, bulletWay)

        spawn(new Bullet(bulletLocation, wayToPlayer))
        new Audio(BULLET_SFX).play()
    }

    /**
     * Handles situation, when game object leaves the bounds of game board
     *
     * @param {Dictionary} bounds Dictionary containing canvas warping bounds
     */
    handleBorderCross(bounds) {
        this.warpBack(bounds)
    }

    /**
     * Handles the collision with other game object
     *
     * @param {GameObject} other Game object this game object collided with
     */
    handleCollision(other) {
        switch(other.type) {
            case ObjectTypes.ASTEROID:
            case ObjectTypes.BULLET:
                this.toDispose = true
                new Audio(UFO_EXPLOSION_SFX).play()
                break
        }
    }

    /**
     * Renders this game object using given @param context
     *
     * @param {CanvasRenderingContext2D} context Context to draw with
     */
    render(context) {
        super.render(context)

        var firstPoint = Vector.add(this.location, this.innerShape[0])

        context.save()
        context.fillStyle = UFO_INNER_COLOR
        context.beginPath()

        context.moveTo(firstPoint.x, firstPoint.y)
        for(var i = 1; i < this.shape.length; i++) {
            var nextPoint = Vector.add(this.location, this.innerShape[i])
            context.lineTo(nextPoint.x, nextPoint.y)
        }

        context.closePath()

        context.stroke()
        context.fill()

        context.restore()
    }
}