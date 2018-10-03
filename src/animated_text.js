
/**
 * @class AnimatedText
 *
 * Represents text able to be moved along horizontal axis
 */
export class AnimatedText {

    /**
     * Constructs base animated text
     *
     * @param {Text} text Text to be displayed
     * @param {Text} font Font setting of the displayed text
     * @param {Text} color Color of displayed text
     * @param {Text} align Alignment setting
     * @param {Number} y Y coordinate of text movement
     * @param {Array} nodes Array of nodes describing its path
     */
    constructor(text, font, color, align, y, nodes) {
        this.text = text
        this.font = font
        this.color = color
        this.align = align

        this.nodes = nodes

        this.timer = 0
        this.currentNode = this.nodes[0]
        this.nextNode = this.nodes[1]
        this.nextNodeIndex = 1

        this.x = this.currentNode.position
        this.y = y
        this.step = computeStep(this.currentNode, this.nextNode)
    }

    /**
     * Procs the timer on this text
     */
    act() {
        if(!this.nextNode) {
            return
        }

        this.x += this.step

        if(this.timer == this.nextNode.time) {
            this.timer = 0
            this.currentNode = this.nextNode
            this.nextNodeIndex += 1

            if(this.nodes.length == this.nextNodeIndex) {
                this.nextNode = null
            } else {
                this.nextNode = this.nodes[this.nextNodeIndex]
                this.step = computeStep(this.currentNode, this.nextNode)
            }
        }

        this.timer += 1
    }

    /**
     * Renders this animatd text
     *
     * @param {CanvasRenderingContext2D} context Context to draw with
     */
    render(context) {
        context.save()

        context.textAlign = this.align

        context.font = this.font
        context.fillStyle = this.color

        context.fillText(this.text, this.x, this.y)

        context.restore()
    }
}

/**
 * Computes movement step for transition in between two nodes
 *
 * @param {Node} startNode Node where motion starts
 * @param {Node} endNode Node where motion ends
 * @returns Movement step of transition between given nodes
 */
function computeStep(startNode, endNode) {
    var distance = endNode.position - startNode.position
    var time = endNode.time

    return distance / time
}

/**
 * @class TextPathNode
 *
 * Represents single node on AnimatedText trajectory
 */
export class TextPathNode {

    /**
     * Constructs base node
     *
     * @param {Number} position Position on horizontal axis
     * @param {Number} time Time in which this position hsould be reached
     */
    constructor(position, time) {
        this.position = position
        this.time = time
    }
}