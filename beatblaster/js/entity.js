// A class representing entities in the game
// moveFunction should never expect anything more than an inputVector as argument
function Entity( stage, image, moveFunction, startX, startY ) {
    this.img = image;
    this.moveFunction = moveFunction;
    if ( this.moveFunction === undefined ) {
        this.moveFunction = function( inputVector ) {
            // Sit still
        }
    }
    this.img.x = startX;
    this.img.y = startY;
}

// PlayerEntity inherits Entity
PlayerEntity.prototype = new Entity();
PlayerEntity.prototype.constructor = PlayerEntity;

function PlayerEntity( stage, image, startX, startY ) {
    var moveFunction = function( inputVector ) {
        var oldX = this.player.img.x;
        var oldY = this.player.img.y;
        if ( inputVector.up )
            this.img.y -= Constants.PLAYER_SPEED;
        if ( inputVector.left )
            this.img.x -= Constants.PLAYER_SPEED;
        if ( inputVector.down )
            this.img.y += Constants.PLAYER_SPEED;
        if ( inputVector.right )
            this.img.x += Constants.PLAYER_SPEED;
        this.correctBoundaries();
    }
    Entity.call( this, stage, image, moveFunction, startX, startY );
}

PlayerEntity.prototype.correctBoundaries = function() {
    var boundaries = this.stage.getBounds();
    var edges = this.img.getTransformedBounds();
    if (edges.x < boundaries.x) {
        // Past left edge
        this.img.x = boundaries.x;
    }
    if (edges.y < boundaries.y) {
        // Past upper edge
        this.img.y = boundaries.y;
    }
    if ((boundaries.x + boundaries.width) < (edges.x + edges.width)) {
        // Past right edge
        this.img.x = (boundaries.x + boundaries.width - edges.width);
    }
    if ((boundaries.y + boundaries.height) < (edges.y + edges.height)) {
        // Past right edge
        this.img.y = (boundaries.y + boundaries.height - edges.height);
    }

};