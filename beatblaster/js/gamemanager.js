// A class for managing the basic gameplay loop
function GameManager( stage, entities, fps ) {
    console.log( "manager" );
    this.stage = stage;
    this.entities = entities;
    this.player = this.entities.player;
    this.fps = fps;
    this.mspf = 1000 / fps; // ms per 
    this.queue = new Queue(); // soundEvent queue
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
}

GameManager.prototype.setUpListeners = function() {
    jQuery( document ).keydown( this.keyDown.bind( this ) );
    jQuery( document ).keyup( this.keyUp.bind( this ) );
    console.log( this.player );
    createjs.Ticker.addEventListener( "tick", this.frameTick.bind( this ) );
};

GameManager.prototype.frameTick = function( event ) {
    this.movePlayer();
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