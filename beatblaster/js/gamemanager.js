// A class for managing the basic gameplay loop
function GameManager( stage, entities, fps ) {
    console.log( "manager" );
    this.stage = stage;
    this.entities = entities;
    this.unpackEntities();
    console.log( this.entities );
    this.player = this.entities.player;
    this.projectiles = [];
    this.fps = fps;
    this.mspf = 1000 / fps; // ms per 
    this.buffer = new Queue(); // soundEvent buffer
    this.soundHandler = new SoundHandler( this.stage, {} /*this.entities.musicTimelineData*/ );
    this.inputVector = {
        up: false,
        left: false,
        down: false,
        right: false
    }

    // Keycodes
    this.UP = 87;
    this.LEFT = 65;
    this.DOWN = 83;
    this.RIGHT = 68;

    this.testCounter = 0;
    this.setUpListeners();
}

GameManager.prototype.unpackEntities = function() {
    this.player = this.entities.player;
};

GameManager.prototype.setUpListeners = function() {
    jQuery( document ).keydown( this.keyDown.bind( this ) );
    jQuery( document ).keyup( this.keyUp.bind( this ) );
    console.log( this.player );
    this.stage.addEventListener( "musicevent", this.musicEventReceiver.bind( this ) );
    createjs.Ticker.addEventListener( "tick", this.frameTick.bind( this ) );
};

GameManager.prototype.frameTick = function( event ) {
    if (this.testCounter === 10) {
        this.stage.dispatchEvent("musicevent");
        this.testCounter = 0;
    }
    else {
        this.testCounter++;
    }
    this.movePlayer();
    this.processBuffer();
    this.moveProjectiles();
    this.stage.update();
};

GameManager.prototype.movePlayer = function() {
    if ( this.inputVector.up )
        this.player.y -= Constants.PLAYER_SPEED;
    if ( this.inputVector.left )
        this.player.x -= Constants.PLAYER_SPEED;
    if ( this.inputVector.down )
        this.player.y += Constants.PLAYER_SPEED;
    if ( this.inputVector.right )
        this.player.x += Constants.PLAYER_SPEED;

}

GameManager.prototype.moveProjectiles = function() {
    jQuery.each( this.projectiles, function( projectile ) {
        if ( this.outOfBounds( projectile.img.getBounds() ) ) {
            // Remove from array
        } else {
            var image = projectile.img;
            var newXY = projectile.nextPoint( image.x, image.y );
            image.x = newXY.x;
            image.y = newXY.y;
        }
    }.bind( this ) );
};

GameManager.prototype.outOfBounds = function( bounds ) {
    // Calculate whether given bounds are inside canvas
    return false;
};

GameManager.prototype.processBuffer = function() {
    // Ensure that we don't process events that might arrive during processing
    var limit = this.buffer.length;
    for ( var i = 0; i < limit; i++ ) {
        this.beatHandler( this.buffer.dequeue() );
    }
};

GameManager.prototype.beatHandler = function( event ) {
    console.log( event );
    if ( true ) {
        this.spawnProjectile( this.player, 0 );
    }
};

GameManager.prototype.musicEventReceiver = function( event ) {
    this.buffer.enqueue( event );
};

GameManager.prototype.keyDown = function( event ) {
    this.keyToggle( event.keyCode, true );
}

GameManager.prototype.keyUp = function( event ) {
    this.keyToggle( event.keyCode, false );
};

GameManager.prototype.keyToggle = function( key, isKeyDown ) {
    if ( key === this.UP )
        this.setUp( isKeyDown );
    if ( key === this.LEFT )
        this.setLeft( isKeyDown );
    if ( key === this.DOWN )
        this.setDown( isKeyDown );
    if ( key === this.RIGHT )
        this.setRight( isKeyDown );
};

GameManager.prototype.setUp = function( isKeyDown ) {
    this.inputVector.up = isKeyDown;
};

GameManager.prototype.setLeft = function( isKeyDown ) {
    this.inputVector.left = isKeyDown;
};

GameManager.prototype.setDown = function( isKeyDown ) {
    this.inputVector.down = isKeyDown;
    isKeyDown
};

GameManager.prototype.setRight = function( isKeyDown ) {
    this.inputVector.right = isKeyDown;
};

GameManager.prototype.spawnProjectile = function( entity, beatType ) {
    jQuery.each( entity.projectiles, function( projectile ) {
        if ( projectile.beatType === beatType ) {
            this.drawProjectile( entity, projectile );
        }
    } ).bid( this );
};

GameManager.prototype.drawProjectile = function( entity, projectile ) {
    var coords = {
        x: entity.img.x,
        y: entity.img.y
    }
    this.spawnImage( coords, projectile.img.clone(), projectile.nextPoint );
};

GameManager.prototype.spawnImage = function( coordinates, image, next ) {
    image.x = coordinates.x;
    image.y = coordinates.y;

    this.projectiles.push( {
        img: image,
        nextPoint: next
    } );
    this.stage.addChild( image );
};