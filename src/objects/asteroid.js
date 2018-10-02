import { spawn, pickRandomLocation, getMaxAsteroidSize } from '..'
import { GameObject, ObjectTypes, project } from './game_object'
import Vector from '../vector'

// ---------------------------------------- Constants ------------------------------------------- //

/** Enum determining initial asteroid speeds */
const AsteroidSpeed = {
    min: 1.0,
    max: 3.0
}

/** Limits of asteroids nodes */
export const AsteroidNodes = {
    min: 3,
    max: 8
}

/** Amount of mass per node (limit) */
const ASTEROID_NODE_MASS = 100

/** Minimal radius of asteroid */
const ASTEROID_MIN_RADIUS = 10.0

/** Radius per node */
const ASTEROID_NODE_RADIUS = 5.0

/** Lower viable limit of asteroid's mass */
const ASTEROID_MIN_MASS = 100

/** Default color of an asteroid */
const ASTEROID_COLOR = 'grey'

/** Delta for bumping to ensure objects won't be even touching */
const BUMP_DELTA = 1.0

/** Angle of displacement of new asteroids */
const BREAK_DISPLACEMENT_ANGLE = Math.PI / 3.0

/** Path to asteroid bump sound effect */
const ASTEROID_SFX = './sfx/asteroid.mp3'

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class Asteroid
 *
 * Represents an uncontrollable asteroid flying through space
 */
export default class Asteroid extends GameObject {

    /**
     * Constructs base asteroid
     *
     * @param {Vector} location Starting location of this asteroid
     * @param {Vector} velocity Base velocity of this asteroid
     * @param {Number} mass Initial mass of asteroid
     */
    constructor(location, velocity, mass) {
        super(location, velocity, [], ASTEROID_COLOR, ObjectTypes.ASTEROID)

        if(!location) {
            this.location = pickRandomLocation()
        }

        if(!velocity) {
            this.velocity = Vector.random()

            this.speed = AsteroidSpeed.min + Math.random() * (AsteroidSpeed.max - AsteroidSpeed.min)
            this.velocity.multiply(this.speed)
        }

        if(mass) {
            this.mass = mass
        } else {
            this.mass = ASTEROID_MIN_MASS + Math.random() * (getMaxAsteroidSize() - AsteroidNodes.min) * ASTEROID_NODE_MASS
        }

        this.score = this.mass
        this.shape = calculateShape(this)
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
                handleAsteroidCollision(this, other)
                new Audio(ASTEROID_SFX).play()
                break

            case ObjectTypes.BULLET:
            case ObjectTypes.UFO:
                handleAsteroidDestruction(this)
                break
        }
    }
}

// ------------------------------------------ Inner --------------------------------------------- //

/**
 * Claculates the shape of given @param asteroid based on its mas
 * 
 * @param {Asteroid} asteroid Asteroid to compute shape for
 * @return New shape of given asteroid
 */
function calculateShape(asteroid) {
    var shape = []
    var nodes = Math.floor(asteroid.mass / ASTEROID_MIN_MASS) + (AsteroidNodes.min - 1)

    var radius = ASTEROID_MIN_RADIUS + ASTEROID_NODE_RADIUS * asteroid.mass / ASTEROID_NODE_MASS
    var angleStep = 2 * Math.PI / nodes

    var angle = 0
    var baseVector = Vector.multiply(new Vector(0.0, 1.0), radius)

    for(var i = 0; i < nodes; i++) {
        shape.push(Vector.rotate(baseVector, angle))
        angle += angleStep
    }

    return shape
}

/**
 * Handles the collision of two asteroids
 *
 * @param {Asteroid} asteroid Asteroid to handle collision for
 * @param {Asteroid} other Other asteroid to handle collision for
 */
function handleAsteroidCollision(asteroid, other) {
    var axis = Vector.subtract(other.location, asteroid.location)
    axis.normalize()

    bumpAway(asteroid, other, axis)
    affectVelocities(asteroid, other)
}

/**
 * Bumps away two colliding asteroids so they won't be touching each other
 *
 * @param {Asteroid} asteroid Asteroid to bump away
 * @param {Asteroid} other Other asteroid to bump away
 * @param {Vector} axis Collision axis of asteroids
 */
function bumpAway(asteroid, other, axis) {
    var asteroidProjection = project(asteroid.shape, asteroid.location, axis)
    var otherProjection = project(other.shape, other.location, axis)

    var overlap
    if(asteroidProjection.min <= otherProjection.min && otherProjection.min <= asteroidProjection.max) {
        overlap = asteroidProjection.max - otherProjection.min
    } else if (otherProjection.min <= asteroidProjection.min && asteroidProjection.min <= otherProjection.max) {
        overlap = otherProjection.max - asteroidProjection.min
    }

    overlap += BUMP_DELTA

    asteroid.location.add(Vector.multiply(axis, -overlap / 2))
    other.location.add(Vector.multiply(axis, overlap / 2))
}

/**
 * Affects the velocities of colliding asteroids
 *
 * @param {Asteroid} asteroid Colliding asteroid
 * @param {Asteroid} other The other colliding asteroid
 */
function affectVelocities(asteroid, other) {
    var x = computeFinalVelocity(asteroid.velocity.x, asteroid.mass, other.velocity.x, other.mass)
    var y = computeFinalVelocity(asteroid.velocity.y, asteroid.mass, other.velocity.y, other.mass)

    asteroid.velocity = new Vector(x.asteroidFinal, y.asteroidFinal)
    other.velocity = new Vector(x.otherFinal, y.otherFinal)
}

/**
 * Computes final velocity along given axis after collision
 *
 * @param {Number} aV Velocity of asteroid
 * @param {Number} aM Mass of asteroid
 * @param {Number} oV Velocity of the other asteroid
 * @param {Number} oM Mass of the other asteroid
 * @returns Tuple of final velocities
 */
function computeFinalVelocity(aV, aM, oV, oM) {
    var oVF = (2 * aM * aV + oM * oV - aM * oV) / (aM + oM)
    var aVF = (oV - aV + oVF)

    return{asteroidFinal: aVF, otherFinal: oVF}
}

/**
 * Handles the destruction process of an asteroid
 *
 * @param {Asteroid} asteroid Asteroid to be destructed
 */
function handleAsteroidDestruction(asteroid) {
    asteroid.toDispose = true

    var newMass = asteroid.mass - ASTEROID_NODE_MASS
    if(newMass < ASTEROID_MIN_MASS) {
        return
    }

    var perpendicular = Vector.perpendicular(asteroid.velocity)
    perpendicular.add(asteroid.location)
    perpendicular.normalize()

    var newRadius = ASTEROID_MIN_RADIUS + ASTEROID_NODE_RADIUS * newMass / ASTEROID_NODE_MASS

    var leftLocation = Vector.add(asteroid.location, Vector.multiply(perpendicular, -newRadius))
    var rightLocation = Vector.add(asteroid.location, Vector.multiply(perpendicular, newRadius))

    var leftBreakVelocity = Vector.rotate(asteroid.velocity, -BREAK_DISPLACEMENT_ANGLE)
    var rightBreakVelocity = Vector.rotate(asteroid.velocity, BREAK_DISPLACEMENT_ANGLE)

    var leftAsteroid = new Asteroid(leftLocation, leftBreakVelocity, newMass)
    var rightAsteroid = new Asteroid(rightLocation, rightBreakVelocity, newMass)

    spawn(leftAsteroid)
    spawn(rightAsteroid)
}