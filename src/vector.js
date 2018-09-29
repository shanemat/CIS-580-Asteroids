
/**
 * @class Vector
 *
 * Represents base class for handling 2D vectors
 */
export default class Vector {

    /**
     * Contructs base vector from given coordinates
     *
     * @param {number} x Vertical coordinate
     * @param {number} y Horizontal coordinate
     */
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    // ---------------------------------- Static -------------------------------------- //

    /**
     * Adds @param first and @param second vectors
     *
     * @param {Vector} first First vector to be added
     * @param {Vector} second Second vector to be added
     * @returns Newly created vector as result of the addition
     */
    static add(first, second) {
        return new Vector(first.x + second.x, first.y + second.y)
    }

    /**
     * Subtracts @param second vector from @param first vector
     *
     * @param {Vector} first The first member of subtraction
     * @param {Vector} second The subtracted vector
     * @returns Newly created vector as result of the subtraction
     */
    static subtract(first, second) {
        return new Vector(first.x - second.x, first.y - second.y)
    }

    /**
     * Creates new multiplied (by @param multiplier) version of @param vector
     *
     * @param {Vector} vector Vector to be multiplied
     * @param {Number} multiplier Number indicating how much should the vector get multiplied
     * @returns Newly created multiplied version of given vector
     */
    static multiply(vector, multiplier) {
        return new Vector(vector.x * multiplier, vector.y * multiplier)
    }

    /**
     * Creates new normalized version of given @param vector
     *
     * @param {Vector} vector Original non-normalized vector
     * @returns Newly created vector as normalized version of given one
     */
    static normalize(vector) {
        var magnitude = vector.magnitude()
        return new Vector(vector.x / magnitude, vector.y / magnitude)
    }

    /**
     * Creates new rotated version (by @param angle) of given @param vector
     *
     * @param {Vector} vector Vector to create rotated version from
     * @param {number} angle  Angle to rotate this vector by (in radians)
     * @returns Newly created vector as rotated version of original one
     */
    static rotate(vector, angle) {
        var sin = Math.sin(angle)
        var cos = Math.cos(angle)

        return new Vector(vector.x * cos - vector.y * sin, vector.x * sin + vector.y * cos)
    }

    /**
     * Creates new vector which is perpendicular to given @param vector
     * 
     * @param {Vector} vector Vector to create perpendicular vector to
     * @returns Newly created perpendicular vector to given vector
     */
    static perpendicular(vector) {
        return new Vector(-vector.y, vector.x)
    }

    /**
     * Computes dot product of @param first and @param second given vector
     *
     * @param {Vector} first First member of dot product operation
     * @param {Vector} second Second member of dot product operation
     * @returns Dot product of given vectors
     */
    static dotProduct(first, second) {
        return first.x * second.x + first.y * second.y
    }

    /**
     * Computed magnitude of given @param vector
     *
     * @param {Vector} vector Vector to compute magnitude of
     * @returns Magnitude of given vector
     */
    static magnitude(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    }

    /**
     * Creates a deep copy of given array of @param vectors
     *
     * @param {Array} vectors Array of vectors to be copied
     * @returns Copy of given array of vectors
     */
    static copyArray(vectors) {
        var copy = []
        vectors.forEach(vector => {
            copy.push(new Vector(vector.x, vector.y))
        });
        return copy
    }

    /**
     * Creates random normalized vector
     *
     * @returns New random normalized vector
     */
    static random() {
        var x = -1.0 + Math.random() * 2
        var y = -1.0 + Math.random() * 2

        return Vector.normalize(new Vector(x, y))
    }

    // ---------------------------------- Member -------------------------------------- //

    /**
     * Adds given @param other vector to this vector
     *
     * @param {Vector} other Other vector to be added
     */
    add(other) {
        this.x += other.x
        this.y += other.y
    }

    /**
     * Subtracts given @param other vector from this vector
     *
     * @param {Vector} other Other vector to be subtracted
     */
    subtract(other) {
        this.x -= other.x
        this.y -= other.y
    }

    /**
     * Multiplies this vector by @param multiplier
     *
     * @param {Number} multiplier Number indicating how much should the vector get multiplied
     */
    multiply(multiplier) {
        this.x *= multiplier
        this.y *= multiplier
    }

    /**
     * Normalizes this vector
     */
    normalize() {
        var magnitude = this.magnitude()

        this.x = this.x / magnitude
        this.y = this.y / magnitude
    }

    /**
     * Rotates this vector by given @param angle
     *
     * @param {number} angle Angle to rotate this vector by (in radians)
     */
    rotate(angle) {
        var sin = Math.sin(angle)
        var cos = Math.cos(angle)

        var x = this.x
        var y = this.y

        this.x = x * cos - y * sin
        this.y = x * sin + y * cos
    }

    /**
     * Turns this vector to its perpendicular version
     */
    perpendiculate() {
        var x = this.x
        var y = this.y

        this.x = -y
        this.y = x
    }

    /**
     * Computes dot product of this and @param other given vector
     *
     * @param {Vector} other The other member of dot product operation
     * @returns Dot product of this and given vector
     */
    dotProduct(other) {
        return this.x * other.x + this.y * other.y
    }

    /**
     * Computes magnitude of this vector
     *
     * @returns Magnitude of this vector
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     * Creates a string representation of this vector
     *
     * @returns String representation of this vector
     */
    toString() {
        return '[' + this.x + ', ' + this.y + ']'
    }
}