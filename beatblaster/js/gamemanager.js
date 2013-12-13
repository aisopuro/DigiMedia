// A class for managing the basic gameplay loop
function GameManager( stage, entities, fps ) {
    console.log( "manager" );
    this.stage = stage;
    this.bounds = this.stage.getBounds();
    this.entities = entities;
    console.log( this.entities );
    this.player = this.entities.player;
    this.dummyEnemy = this.entities.dummyEnemy;
    this.projectiles = [];
    this.projectileIndexes = [];
    this.fps = fps;
    this.mspf = 1000 / fps; // ms per frame
    this.buffer = new Queue(); // soundEvent buffer
    this.soundHandler = this.entities.soundHandler; // Maybe do this in builder
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

    this.setUpListeners();
	
	// maybe move this somewhere else
	this.soundHandler.startMusic();
	
}

GameManager.prototype.setUpListeners = function() {
    jQuery( document ).keydown( this.keyDown.bind( this ) );
    jQuery( document ).keyup( this.keyUp.bind( this ) );
    console.log( this.player );
    console.log( this.buffer );
    this.stage.addEventListener( "musicevent", this.musicEventReceiver.bind( this ) );
    createjs.Ticker.setFPS( this.fps );
    createjs.Ticker.addEventListener( "tick", this.frameTick.bind( this ) );
};

GameManager.prototype.frameTick = function( event ) {
	this.soundHandler.tick();
    this.movePlayer();
    this.processBuffer();
    this.processEnemies();
    this.moveProjectiles();
    this.stage.update();
};

GameManager.prototype.movePlayer = function() {
    var oldX = this.player.img.x;
    var oldY = this.player.img.y;
    if ( this.inputVector.up )
        this.player.img.y -= Constants.PLAYER_SPEED;
    if ( this.inputVector.left )
        this.player.img.x -= Constants.PLAYER_SPEED;
    if ( this.inputVector.down )
        this.player.img.y += Constants.PLAYER_SPEED;
    if ( this.inputVector.right )
        this.player.img.x += Constants.PLAYER_SPEED;
    if ( this.outOfBounds( this.player.img ) ) {
        // Player out of bounds, don't allow movement
        console.log( "outOfBounds" );
        this.player.img.x = oldX;
        this.player.img.y = oldY;
    }

}

GameManager.prototype.moveProjectiles = function() {
    // loop through all projectiles
    for ( var i in this.projectiles ) {
        var projectile = this.projectiles[ i ];
        if ( projectile && projectile.img ) {
            // first check if needs to be removed
            if ( this.outOfBounds( projectile.img ) ) {
                // remove from stage
                this.stage.removeChild( projectile.img );
                // remove from array
                this.projectiles.splice( i, 1 );
            }
            // process the rest AFTER or else indexes go wrong
            projectile.move( projectile.img );
        }
    }
};

GameManager.prototype.outOfBounds = function( image ) {
    // Calculate whether given bounds are inside canvas
    var dim = image.getTransformedBounds();
    edges = {
        left: dim.x,
        up: dim.y,
        right: dim.x + dim.width,
        down: dim.y + dim.height
    }
    return !this.contains( this.stage.getBounds(), edges );
};

GameManager.prototype.contains = function( bounds, edges ) {
    return (
        bounds.x <= edges.left &&
        bounds.y <= edges.up &&
        edges.right <= bounds.width &&
        edges.down <= bounds.height
    );
};

GameManager.prototype.covers = function( bounds, edges ) {
    // test if the edges are within the bounds given
    return (
        ( bounds.x <= edges.left && edges.left <= bounds.width ) ||
        ( bounds.x <= edges.right && edges.right <= bounds.width ) ||
        ( bounds.y <= edges.up && edges.up <= bounds.height ) ||
        ( bounds.y <= edges.down && edges.down <= bounds.height )
    );

};

GameManager.prototype.processBuffer = function() {
    // Ensure that we don't process events that might arrive during processing
    var limit = this.buffer.getLength();
    for ( var i = 0; i < limit; i++ ) {
        this.beatHandler( this.buffer.dequeue() );
    }
};

// function for determining the appropriate action to take on a beat
GameManager.prototype.beatHandler = function( event ) {
    if ( event.note === SoundHandler.BASS && event.data == "start" ) {
        var proj = this.player.fireGuns( event.note );
        this.stage.addChild( proj.img );
        this.projectiles.push( proj );
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
    jQuery.each( entity.projectiles, function( index, projectile ) {
        if ( projectile.beatType === beatType ) {
            this.drawProjectile( entity, projectile );
        }
    }.bind( this ) );
};

GameManager.prototype.drawProjectile = function( entity, projectile ) {
    // Relate spawn point to owning entity's coordinates
    var coordinates = entity.getGunLocation();

    // Get next image from the set of projectiles
    var image = this.getNextProjectileImage( projectile );
    image.x = coordinates.x;
    image.y = coordinates.y;

};

GameManager.prototype.getNextProjectileImage = function( projectile ) {
    if ( projectile.cursor >= projectile.imageCount )
        projectile.cursor = 0;
    var image = projectile.images[ projectile.cursor ];
    projectile.cursor++;
    image.active = true;
    return image;
};

GameManager.prototype.processEnemies = function() {
    this.stage.addChild( this.dummyEnemy.img );
};