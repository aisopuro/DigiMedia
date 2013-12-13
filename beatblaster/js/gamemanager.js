// A class for managing the basic gameplay loop
function GameManager( stage, entities, fps ) {
    console.log( "manager" );
    this.stage = stage;
    this.bounds = this.stage.getBounds();
    this.entities = entities;
    console.log( this.entities );
    this.player = this.entities.player;
    this.dummyEnemy; // @TEST
    this.enemies = [];
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

    this.bg = this.entities.bg;
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
    this.bg.updateStars( this.player.img.x, this.player.img.y );
    this.stage.update();
};

GameManager.prototype.movePlayer = function() {
    this.player.moveFunction( this.inputVector );

}

GameManager.prototype.moveProjectiles = function() {
    // loop through all projectiles
    for ( var i in this.projectiles ) {
        var projectile = this.projectiles[ i ];
        if ( projectile && projectile.img ) {
            // first check if needs to be removed
            if ( this.outOfBounds( projectile.img ) ) {
                this.removeEntity( this.projectiles, projectile, i );
            } else {
                // Otherwise check if the projectile hits an enemy
                var projectileBounds = this.getTranslatedEdges( projectile.img );
                for ( var j in this.enemies ) {
                    var enemy = this.enemies[ j ];
                    var enemyBounds = this.getTranslatedEdges( enemy.img );
                    if ( this.covers( enemyBounds, projectileBounds ) ) {
                        // Projectile is within enemy, hit
                        this.removeEntity( this.projectiles, projectile, i );
                        this.hitEnemy( enemy, projectile );
                    }
                }
            }
            // process the rest AFTER or else indexes go wrong
            projectile.move( projectile.img );
        }
    }
};

GameManager.prototype.removeEntity = function( array, entity, index ) {
    // remove from stage
    this.stage.removeChild( entity.img );
    // remove from array
    array.splice( index, 1 );
};

GameManager.prototype.hitEnemy = function( enemy, projectile ) {
    console.log( "hit" );
};

GameManager.prototype.outOfBounds = function( image ) {
    // Calculate whether given bounds are inside canvas
    var edges = this.getTranslatedEdges( image );
    return !this.contains( this.stage.getBounds(), edges );
};

GameManager.prototype.contains = function( bounds, edges ) {
    // Tests if the given edges are completely contained by the bounds
    return (
        bounds.x <= edges.left &&
        bounds.y <= edges.up &&
        edges.right <= bounds.width &&
        edges.down <= bounds.height
    );
};

GameManager.prototype.covers = function( bounds, edges ) {
    // test for intersection
    return (
        /*
        ( bounds.left <= edges.left && edges.left <= bounds.right ) ||
        ( bounds.left <= edges.right && edges.right <= bounds.right ) ||
        ( bounds.left <= edges.up && edges.up <= bounds.right ) ||
        ( bounds.left <= edges.down && edges.down <= bounds.right )
        */
        (edges.left < bounds.right) &&
        (edges.right > bounds.left) &&
        (edges.up < bounds.down) &&
        (edges.down > bounds.up)
    );

};

// Get an object containing the edge-coordinates of an image on the stage
GameManager.prototype.getTranslatedEdges = function( image ) {
    var dim = image.getTransformedBounds();
    return {
        left: dim.x,
        up: dim.y,
        right: dim.x + dim.width,
        down: dim.y + dim.height
    }
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
    if ( event.note !== undefined && event.data == "start" ) {
        var projectile = this.player.fireGuns( event.note );
        if ( $.isArray( projectile ) ) {
            for ( var i = 0; i < projectile.length; i++ ) {
                this.stage.addChild( projectile[ i ].img );
                this.projectiles.push( projectile[ i ] );
            }
        } else {
            this.stage.addChild( projectile.img );
            this.projectiles.push( projectile );
        }
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
    console.log( this.enemies.length );
    if ( this.enemies === undefined || this.enemies.length === 0 ) {
        this.enemies = EnemyFactory.getNextWave( this.stage );
    }
    var enemy;
    for ( var i in this.enemies ) {
        enemy = this.enemies[ i ];
        enemy.move();
        if ( enemy.outOfBounds() ) {
            this.removeEntity( this.enemies, enemy, i );
        }

    }
};