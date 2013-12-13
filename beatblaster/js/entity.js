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
    this.stage = stage;
    this.stage.addChild( this.img );
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
    this.guns = [];
    this.setUpGuns();
}

PlayerEntity.prototype.correctBoundaries = function() {
    var boundaries = this.stage.getBounds();
    var edges = this.img.getTransformedBounds();
    if ( edges.x < boundaries.x ) {
        // Past left edge
        this.img.x = boundaries.x;
    }
    if ( edges.y < boundaries.y ) {
        // Past upper edge
        this.img.y = boundaries.y;
    }
    if ( ( boundaries.x + boundaries.width ) < ( edges.x + edges.width ) ) {
        // Past right edge
        this.img.x = ( boundaries.x + boundaries.width - edges.width );
    }
    if ( ( boundaries.y + boundaries.height ) < ( edges.y + edges.height ) ) {
        // Past right edge
        this.img.y = ( boundaries.y + boundaries.height - edges.height );
    }

};

PlayerEntity.prototype.setUpGuns = function() {
    // Bass
    // Create projectile image
    var image = new createjs.Shape();
    image.graphics.beginFill( "#ff0000" ).drawRoundRect( 0, 0, 10, 50, 5 );
    image.setBounds( 0, 0, 10, 50 );

    var gunBass = new Gun( this.img, image );
    gunBass.fireLeft = false;

    // The function for determining the shoot pattern
    var shoot = function() {
        // Because of the bind at the end, 'this' refers to the owning gun, 
        // not this entity
        var copy = this.image.clone();
        var offX = 104;
        var offY = 15;
        if (this.fireLeft) {
            offX = 84;
        } 
        this.fireLeft = !this.fireLeft;
        copy.x = this.ownerImage.x + offX;
        copy.y = this.ownerImage.y + offY;

        return {
            img: copy,
            move: function(image) {
                image.y -= 10;
            }
        }
    }.bind( gunBass );
};