/* 
A central initializer for the Beat Blaster game.
The Game class handles program initialization and acts as an interface between
the various constructor classes before initializing the main gameplay loop.
 */
function Game( canvas, id ) {
    this.HEIGHT = 600;
    this.WIDTH = 600;
    this.canvas = canvas;
    this.id = id;
    this.stage;
    this.loader;
    this.builder;
    this.manager;

    this.FPS = 30;

    this.initGame( this.canvas );

    this.timeout;
    this.stars = [];
    for ( var i = 0; i < 50; i++ ) {
        this.stars[ i ] = {
            x: Math.floor( Math.random() * this.WIDTH ),
            y: Math.floor( Math.random() * this.HEIGHT ),
            s: 1 + Math.floor( Math.random() * 2 )
        };
    }
}

Game.prototype.setUpCanvas = function( canvas ) {
    canvas.attr( {
        width: this.WIDTH,
        height: this.HEIGHT
    } );
}

// The function called when Loader is done
Game.prototype.loadComplete = function( loadedAssets ) {
    console.log( "Load Complete" );
    this.stage = new createjs.Stage( this.canvas[ 0 ] );
    this.stage.setBounds( 0, 0, this.WIDTH, this.HEIGHT );
    this.builder = new Builder( this.stage, loadedAssets, this.buildComplete.bind( this ) );
}

// To show a loading screen
Game.prototype.loadingMode = function( canvas ) {
    var c2 = canvas.getContext( "2d" );
    c2.fillStyle = "rgb(80,80,80)";
    c2.fillRect( 0, 0, this.WIDTH, this.HEIGHT );
    c2.fillStyle = "rgb(0, 0, 0)";
    c2.font = "30px Monospace";
    c2.textAlign = "center";
    c2.textBaseline = "middle";
    c2.fillText( "Loading...", this.WIDTH / 2, this.HEIGHT / 2 );
};

// The function called when Builder is done
Game.prototype.buildComplete = function( stage, entities ) {
    console.log( "Builder done" );
    this.waitToStart( stage, entities );
};

Game.prototype.tickWait = function() {
    var c2 = this.stage.canvas.getContext( "2d" );
    c2.fillStyle = "rgb(0,0,0)";
    c2.fillRect( 0, 0, this.WIDTH, this.HEIGHT );
    c2.fillStyle = "rgb(255,255,255)";
    for ( var i = 0; i < this.stars.length; i++ ) {
        c2.fillRect( this.stars[ i ].x, this.stars[ i ].y, 1, 1 );
        this.stars[ i ].y += this.stars[ i ].s;
        if ( this.stars[ i ].y > this.HEIGHT ) {
            this.stars[ i ].y -= this.HEIGHT;
        }
    }
    c2.font = "24px Monospace";
    c2.textAlign = "center";
    c2.textBaseline = "middle";
    c2.fillText( "Click anywhere to start.", this.WIDTH / 2, this.HEIGHT / 2 - 20 );
    c2.fillText( "Use WASD to move.", this.WIDTH / 2, this.HEIGHT / 2 + 20 );
}

Game.prototype.waitToStart = function( stage, entities ) {
    this.entities = entities;
    stage.addEventListener( "click", this.startGame.bind( this ) );
    this.timeout = setInterval( this.tickWait.bind( this ), 50 );
};

// Start the gameplay loop
Game.prototype.startGame = function( entities ) {
    this.stage.removeAllEventListeners( "click" );
    this.stage.removeChild( this.starttext );
    clearInterval( this.timeout );
    this.manager = new GameManager( this.stage, this.entities, this.FPS );
}

// The initializer function. Expects a canvas element as argument.
Game.prototype.initGame = function( canvas ) {
    // Ensure canvas is a jQuery object
    if ( !( canvas instanceof jQuery ) ) {
        canvas = jQuery( canvas );
    }
    this.setUpCanvas( canvas );

    this.loadingMode( canvas[ 0 ] );

    // Load resources
    var game = this;
    jQuery.getScript( "./beatblaster/js/loader.js", function( data, textStatus, jqxhr ) {
        if ( jqxhr.status !== 200 ) {
            // Load failed, abort
            console.log( "Couldn't load loader, status: " + textStatus );
            return;
        }
        // Preloader loaded, initialize
        this.loader = new Loader( game.loadComplete.bind( game ) );
    } );
}