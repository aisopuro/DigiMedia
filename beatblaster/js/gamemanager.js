/* 
A class for managing the basic gameplay loop
The GameManager class is responsible for overall control of the game canvas.
It handles hit-and collision detection between entities and projectiles. It 
also keeps the player's score and is responsible for managing th musicevents 
at the heart of the game.
@stage: the createjs.Stage instance to be managed
@entities: an object containing the precosntructed entities to be used by 
the class
@fps: the framerate at which the game should run
*/

function GameManager( stage, entities, fps ) {
    this.stage = stage;
    this.bounds = this.stage.getBounds(); // The bounds of the stage
    this.entities = entities;
    this.player = this.entities.player; // The player entity
    this.score = 0;

    this.scoreBoard = new createjs.Text(
        this.score,
        "30px Monospace",
        "#ffffff" );
    this.endScreen = new createjs.Text( "Game Over", "30px Monospace", "#ffffff" );
    this.endScreen.x = this.bounds.width / 2;
    this.endScreen.y = this.bounds.height / 2;
    this.endScreen.textAlign = "center";
    this.endScreen.textBaseline = "middle";
	
	this.endScreen2 = new createjs.Text( "Click to restart", "18px Monospace", "#ffffff" );
    this.endScreen2.x = this.bounds.width / 2;
    this.endScreen2.y = this.bounds.height / 2 + 30;
    this.endScreen2.textAlign = "center";
    this.endScreen2.textBaseline = "middle";

    this.enemies = []; // The list of active enemy entities
    this.projectiles = []; // The list of active projectiles

    this.fps = fps;
    this.buffer = new Queue(); // musicevent buffer
    this.soundHandler = this.entities.soundHandler;
    this.inputVector = { // The structure that houses user input information
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

    this.gameover = false;

    this.bg = this.entities.bg; // Background

    this.stage.addChild( this.scoreBoard );
    this.setUpListeners();

    // difinitely move this somewhere else
    this.soundHandler.startMusic();

}

// Set up necessary event listeners
GameManager.prototype.setUpListeners = function() {
    jQuery( document ).keydown( this.keyDown.bind( this ) );
    jQuery( document ).keyup( this.keyUp.bind( this ) );

    this.stage.addEventListener( "musicevent", this.musicEventReceiver.bind( this ) );
    this.stage.addEventListener( "musicend", this.endEventReceiver.bind( this ) );

    createjs.Ticker.setFPS( this.fps );
    createjs.Ticker.addEventListener( "tick", this.frameTick.bind( this ) );
};

// The central tick handler. Basically called every frame refresh
GameManager.prototype.frameTick = function( event ) {
    this.soundHandler.tick();
    this.movePlayer();
    this.processBuffer();
    this.processEnemies();
    this.moveProjectiles();
    this.bg.updateStars( this.player.img.x, this.player.img.y );
    this.scoreBoard.text = this.score;
    this.stage.update();
};

GameManager.prototype.movePlayer = function() {
    this.player.moveFunction( this.inputVector );

}

// Move all active projectiles
GameManager.prototype.moveProjectiles = function() {
    // loop through all projectiles
    for ( var i in this.projectiles ) {
        var projectile = this.projectiles[ i ];
        if ( projectile && projectile.img ) {
            // first check if projectile needs to be removed
            if ( this.outOfBounds( projectile.img ) ) {
                this.removeEntity( this.projectiles, projectile, i );
            } else {
                // Otherwise check if the projectile hits an enemy
                var projectileBounds = this.getTranslatedEdges( projectile.img );
                for ( var j in this.enemies ) {
                    var enemy = this.enemies[ j ];
                    var enemyBounds = this.getTranslatedEdges( enemy.img );
                    if ( this.overlaps( enemyBounds, projectileBounds ) ) {
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
    var wasremoved = this.stage.removeChild( entity.img );
    // remove from array
    array.splice( index, 1 );

    if ( !wasremoved ) {
        console.log( "Couldn't remove", entity );
		entity.img.visible = false;
    }
};

GameManager.prototype.hitEnemy = function( enemy, projectile ) {
    var points = enemy.hitBy( projectile );
    if ( points >= 0 ) {
        // Enemy was killed
        this.score += points;
        this.destroy( enemy );
    }
};

// Calculate whether given bounds are inside canvas
GameManager.prototype.outOfBounds = function( image ) {
    var edges = this.getTranslatedEdges( image );
    return !this.contains( this.stage.getBounds(), edges );
};

// Tests if the given edges are completely contained by the bounds
GameManager.prototype.contains = function( bounds, edges ) {
    return (
        bounds.x <= edges.left &&
        bounds.y <= edges.up &&
        edges.right <= bounds.width &&
        edges.down <= bounds.height
    );
};

// Function for testing rectangle overlap
GameManager.prototype.overlaps = function( bounds, edges ) {
    return (
        ( edges.left < bounds.right ) &&
        ( edges.right > bounds.left ) &&
        ( edges.up < bounds.down ) &&
        ( edges.down > bounds.up )
    );

};

// Get an object containing the edge-coordinates of an image in relation to 
// the stage's coordinate system
GameManager.prototype.getTranslatedEdges = function( image ) {
    var dim = image.getTransformedBounds();
    return {
        left: dim.x,
        up: dim.y,
        right: dim.x + dim.width,
        down: dim.y + dim.height
    }
};

// The central function for processing a set amount of the event buffer
GameManager.prototype.processBuffer = function() {
    // Ensure that we don't process events that might arrive during processing
    var limit = this.buffer.getLength();
    for ( var i = 0; i < limit; i++ ) {
        this.beatHandler( this.buffer.dequeue() );
    }
};

// function for determining the appropriate action to take on a beat
GameManager.prototype.beatHandler = function( event ) {
    if ( event.note !== undefined && event.data == "start" && this.player.frozen == false ) {
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

// Handler function for musicevents. It stores events in a buffer for later 
// processing
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
};

GameManager.prototype.setRight = function( isKeyDown ) {
    this.inputVector.right = isKeyDown;
};

// Function for processing all active enemies on screen
GameManager.prototype.processEnemies = function() {
    if ( this.gameover == false && (this.enemies === undefined || this.enemies.length === 0) ) {
        this.enemies = EnemyFactory.getNextWave( this.stage );
    }
    var enemy;
    for ( var i in this.enemies ) {
        enemy = this.enemies[ i ];
        enemy.move();
        if ( enemy.outOfBounds() ) {
            this.removeEntity( this.enemies, enemy, i );
        } else if ( this.overlaps( this.getTranslatedEdges( this.player.img ), this.getTranslatedEdges( enemy.img ) ) ) {
            // Collision with player
			if (this.player.freeze(2500)) { 
				this.explosion( this.player.img.x+100, this.player.img.y+100 );
				this.player.img.x = Constants.PLAYER_START_X;
				this.player.img.y = Constants.PLAYER_START_Y;
			}
        }

    }
};

// Enemy destroyed on screen
GameManager.prototype.destroy = function( enemy ) {
    this.explosion( enemy.img.x + 30, enemy.img.y + 55 );
    this.removeEntity( this.enemies, enemy, this.enemies.indexOf( enemy ) );
};

GameManager.prototype.endEventReceiver = function( event ) {
    console.log( "It's all over" );
	this.player.freeze(-1);
	this.stage.addChild(this.endScreen);
	this.stage.addChild(this.endScreen2);
	this.gameover = true;
	this.stage.addEventListener("click",  this.restartGame.bind(this) );
};

GameManager.prototype.restartGame = function() {
	this.stage.removeAllEventListeners("click");
	this.player.img.x = Constants.PLAYER_START_X;
	this.player.img.y = Constants.PLAYER_START_Y;
	this.player.unfreeze();
	this.score = 0;
	for ( var i in this.enemies ) {
		enemy = this.enemies[ i ];
		this.removeEntity( this.enemies, enemy, i );
	}
	for ( var i in this.projectiles ) {
		proj = this.projectiles[ i ];
		this.removeEntity( this.projectiles, proj, i );
	}
	this.enemies = [];
	EnemyFactory.LastSentWave = 0;
	this.score = 0;
	this.soundHandler.resetData(GameManager.fullTimeline);
	this.soundHandler.registerMusic(Constants.BGMUSIC_ID);
	this.soundHandler.startMusic();
	this.gameover = false;
	this.stage.removeChild(this.endScreen);
	this.stage.removeChild(this.endScreen2);
};


GameManager.prototype.explosion = function( x, y ) {
	var circle = new createjs.Shape();
	circle.x = x;
	circle.y = y;
	circle.graphics.beginStroke( "#fd0" ).drawCircle( 0, 0, 4 );
	circle.stage = this.stage;
	circle.size = 12;
	this.stage.addChild( circle );
	circle.addEventListener( "tick", function( e ) {
		this.size += 4;
		this.graphics.clear().beginFill( "#fd0" ).drawCircle( 0, 0, this.size );
		if ( this.size > 40 ) {
			this.stage.removeChild( this );
		}
	}.bind( circle ) );
};
