import Vector from '../vector'

// ---------------------------------------- Constants ------------------------------------------- //

/**
 * Represents enum holding possible game object types
 */
export const ObjectTypes = {
    ASTEROID: 0,
    BULLET: 1,
    SPACESHIP: 2,
    UFO: 3
}

/** Number of frames between change of flickering states */
const FLICKER_RATE = 5

// ------------------------------------------ Class --------------------------------------------- //

/**
 * @class GameObject
 *
 * Contains base properties and methods common to all game objects
 */
export class GameObject {

    /**
     * Constructs base game object
     *
     * @param {Vector} location Starting location of this game object
     * @param {Vector} velocity Velocity of given game object
     * @param {Array} shape Array of points giving shape to this game object
     * @param {Text} color Color used for rendering this game object
     * @param {ObjectType} type Type of game object
     * @param {Number} number Score awarded after destruction
     */
    constructor(location, velocity, shape, color, type, score) {
        if(this.constructor === GameObject) {
            throw new TypeError('Class GameObject is abstract and should not be instantiated!')
        }

        this.location = location
        this.velocity = velocity

        this.shape = shape
        this.type = type

        this.score = score

        this.toDispose = false
        this.collidable = true

        this.flickers = false

        this.visible = true
        this.flickerCount = FLICKER_RATE

        if(color) {
            this.color = color
        } else {
            this.color = 'white'
        }
    }

    /**
     * Rotates this game object by specified @param angle
     *
     * @param {number} angle Angle to rotate this game object by
     */
    rotate(angle) {
        this.shape.forEach(point => {
            point.rotate(angle);
        });
    }

    /**
     * Moves this game object to given @param location
     *
     * @param {Vector} location New location of this game object
     */
    moveTo(location) {
        this.location = location
    }

    /**
     * Moves this game object by given vector
     *
     * @param {Vector} vector Vector which should be added to game object's location
     */
    moveBy(vector) {
        this.location.add(vector)
    }

    /**
     * Sets the location of this game object to warped one
     *
     * @param {Dictionary} bounds Game board warping bounds
     */
    warpBack(bounds) {
        this.location.x = warp(bounds.left, this.location.x, bounds.right)
        this.location.y = warp(bounds.top, this.location.y, bounds.bottom)
    }

    /**
     * Simulates the behavior of this game object during one frame
     */
    act() {
        this.moveBy(this.velocity)
        handleFlickering(this)
    }

    /**
     * Handles situation, when game object leaves the bounds of game board
     *
     * @param {Dictionary} bounds Dictionary containing canvas warping bounds
     */
    handleBorderCross(bounds) {
        throw new TypeError('Class ' + this.constructor.name + ' should override the \'handleBorderCross\' function')
    }

    /**
     * Handles the collision with other game object
     *
     * @param {GameObject} other Game object this game object collided with
     */
    handleCollision(other) {
        throw new TypeError('Class ' + this.constructor.name + ' should override the \'handleCollision\' function')
    }

    /**
     * Renders this game object using given @param context
     *
     * @param {CanvasRenderingContext2D} context Context to draw with
     */
    render(context) {
        if(!this.visible) {
            return
        }

        var firstPoint = Vector.add(this.location, this.shape[0])

        context.save()
        context.fillStyle = this.color
        context.beginPath()

        context.moveTo(firstPoint.x, firstPoint.y)
        for(var i = 1; i < this.shape.length; i++) {
            var nextPoint = Vector.add(this.location, this.shape[i])
            context.lineTo(nextPoint.x, nextPoint.y)
        }

        context.closePath()

        context.stroke()
        context.fill()

        context.restore()
    }

    /**
     * Checks whether does this game object collide with @param other
     *
     * @param {GameObject} other Other game object to check collision with
     * @returns True in case game objects collide, false otherwise
     */
    collidesWith(other) {
        if(!this.collidable || !other.collidable) {
            return false
        }

        var axes = findAxes(this.shape).concat(findAxes(other.shape))
        for(var i = 0; i < axes.length; i++) {
            var thisProjection = project(this.shape, this.location, axes[i])
            var otherProjection = project(other.shape, other.location, axes[i])

            if(thisProjection.max < otherProjection.min || otherProjection.max < thisProjection.min) {
                return false
            }
        }

        return true
    }

    /**
     * Checks whether this game object is outside given @param bounds
     *
     * @param {Dictionary} bounds Bounds for location to be checked against
     */
    isOutsideBounds(bounds) {
        return (this.location.x < bounds.left) ||
                (bounds.right < this.location.x) ||
                (this.location.y < bounds.top) ||
                (bounds.bottom < this.location.y)
    }
}

// ------------------------------------------ Inner --------------------------------------------- //

/**
 * Finds axes for given @param shape (array of points)
 *
 * @param {Array} shape Array of points to find axes for
 * @returns Array of axes corresponding to given shape
 */
function findAxes(shape) {
    var axes = [];

    shape.forEach((point, index) => {
        var nextIndex = (index + 1 == shape.length) ? 0 : index + 1
        var nextPoint = shape[nextIndex]

        var axis = Vector.subtract(nextPoint, point)
        axis.perpendiculate()
        axis.normalize()
        axes.push(axis)
    })

    return axes
}

/**
 * Projects @param shape of game object onto given @param axis
 *
 * @param {Array} shape Array of points of game object to be projected
 * @param {Vector} location Location of shape
 * @param {Vector} axis Axis to project game object onto
 * @returns Tuple containing bounds of projection of game object
 */
export function project(shape, location, axis) {
    var min = Vector.dotProduct(Vector.add(shape[0], location), axis)
    var max = min

    for(var i = 1; i < shape.length; i++) {
        var projection = Vector.dotProduct(Vector.add(shape[i], location), axis)
        if(projection < min) {
            min = projection
        } else if(max < projection) {
            max = projection
        }
    }

    return {min: min, max: max}
}

/**
 * Warps value into given bounds
 *
 * @param {Number} min Minimal valid value for warping
 * @param {Number} position Currect object position (1D)
 * @param {Number} max Maximal valid value for warping
 * @returns Warped value of position
 */
function warp(min, position, max) {
    if(position < min) {
        return max - (min - position)
    } else if(max < position) {
        return min + (position - max)
    } else {
        return position
    }
}

/**
 * Handles the flickering effect for game object
 *
 * @param {GameObject} gameObject The object to handle flickering for
 */
function handleFlickering(gameObject) {
    if(gameObject.flickers) {
        if(gameObject.flickerCount > 0) {
            gameObject.flickerCount -= 1
        } else {
            gameObject.visible = !gameObject.visible
            gameObject.flickerCount = FLICKER_RATE
        }
    } else {
        gameObject.visible = true
    }
}