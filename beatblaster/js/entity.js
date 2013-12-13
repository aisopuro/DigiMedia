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
//PlayerEntity.prototype = new Entity();
//PlayerEntity.prototype.constructor = PlayerEntity;
// Inheritance not working, skip it
function PlayerEntity( stage, image, startX, startY ) {
    this.img = image;
    this.img.x = startX;
    this.img.y = startY;
    this.stage = stage;
    this.stage.addChild( this.img );
	this.speedX = 0;
	this.speedY = 0;
    this.moveFunction = function( inputVector ) {
        var oldX = this.img.x;
        var oldY = this.img.y;
		
		this.speedX *= Constants.PLAYER_FRICTION;
		this.speedY *= Constants.PLAYER_FRICTION;
		
        if ( inputVector.up )
            this.speedY -= Constants.PLAYER_ACCELERATION;
        if ( inputVector.left )
            this.speedX -= Constants.PLAYER_ACCELERATION;
        if ( inputVector.down )
            this.speedY += Constants.PLAYER_ACCELERATION;
        if ( inputVector.right )
			this.speedX += Constants.PLAYER_ACCELERATION;
		
        this.img.x += this.speedX;
		this.img.y += this.speedY;   
		
        this.correctBoundaries();
    }
    //Entity.call( this, stage, image, moveFunction, startX, startY );
    this.guns = [];
    this.setUpGuns();
}

PlayerEntity.prototype.stop = function() {
	this.speedX = 0;
	this.speedY = 0;
}

PlayerEntity.prototype.correctBoundaries = function() {
    var boundaries = this.stage.getBounds();
    var edges = this.img.getTransformedBounds();
    //var offsets = this.img.getBounds();
    if ( edges.x < boundaries.x ) {
        // Past left edge
        this.img.x = boundaries.x - Constants.PLAYER_BOUND_LEFT;
		this.stop();
    }
    if ( edges.y < boundaries.y ) {
        // Past upper edge
        this.img.y = boundaries.y - Constants.PLAYER_BOUND_UP;
		this.stop();
    }
    if ( ( boundaries.x + boundaries.width ) < ( edges.x + edges.width ) ) {
        // Past right edge
        this.img.x = ( boundaries.x + boundaries.width - edges.width - Constants.PLAYER_BOUND_LEFT);
		this.stop();
    }
    if ( ( boundaries.y + boundaries.height ) < ( edges.y + edges.height ) ) {
        // Past right edge
        this.img.y = ( boundaries.y + boundaries.height - edges.height - Constants.PLAYER_BOUND_UP);
		this.stop();
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
        if ( this.fireLeft ) {
            offX = 84;
        }
        this.fireLeft = !this.fireLeft;
        copy.x = this.ownerImage.x + offX;
        copy.y = this.ownerImage.y + offY;

        return {
            img: copy,
            move: function( image ) {
                image.y -= 10;
            }
        }
    }.bind( gunBass );
    gunBass.shoot = shoot;

    this.guns[ SoundHandler.BASS ] = gunBass;
};

PlayerEntity.prototype.fireGuns = function( beatType ) {
    var gun = this.guns[ beatType ];
    return gun.shoot();
};