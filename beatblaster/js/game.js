/* A central initializer and loop for the Beat Blaster game */
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
}

Game.prototype.setUpCanvas = function( canvas ) {
    canvas.attr( {
        width: this.WIDTH,
        height: this.HEIGHT
    } );
}

Game.prototype.loadComplete = function( loadedAssets ) {
    console.log( "Load Complete" );
    console.log( this.canvas[ 0 ] );
    this.stage = new createjs.Stage( this.canvas[ 0 ] );
    this.stage.setBounds( 0, 0, this.WIDTH, this.HEIGHT );
    console.log( this.stage );
    this.builder = new Builder( this.stage, loadedAssets, this.buildComplete.bind( this ) );
}

Game.prototype.loadingMode = function( canvas ) {
	var c2 = canvas.getContext("2d");
	c2.fillStyle = "rgb(80,80,80)";
	c2.fillRect(0, 0, this.WIDTH, this.HEIGHT);
	c2.fillStyle = "rgb(0, 0, 0)";
	c2.font = "24px Helvetica";
	c2.textAlign = "center";
	c2.textBaseline = "middle";
	c2.fillText("Loading...", this.WIDTH/2, this.HEIGHT/2);
};

Game.prototype.buildComplete = function( stage, entities ) {
    console.log( "Builder done" );
    console.log( stage );
    this.waitToStart( stage, entities );
};

Game.prototype.waitToStart = function( stage, entities ) {
	this.entities = entities;
	var c2 = stage.canvas.getContext("2d");
	c2.fillStyle = "rgb(0,0,0)";
	c2.fillRect(0, 0, this.WIDTH, this.HEIGHT);
	c2.fillStyle = "rgb(255,255,255)";
	c2.font = "24px Helvetica";
	c2.textAlign = "center";
	c2.textBaseline = "middle";
	c2.fillText("Click anywhere to start.", this.WIDTH/2, this.HEIGHT/2 -20);
	c2.fillText("Use WASD to move.", this.WIDTH/2, this.HEIGHT/2 +20);
	stage.addEventListener("click", this.startGame.bind(this) );
};

Game.prototype.startGame = function(entities) {
	this.stage.removeAllEventListeners("click");
	this.stage.removeChild(this.starttext);
	this.manager = new GameManager( this.stage, this.entities, this.FPS );
}

// The initializer function. Expects a canvas element as argument.
Game.prototype.initGame = function( canvas ) {
    // Ensure canvas is a jQuery object
    if ( !( canvas instanceof jQuery ) ) {
        canvas = jQuery( canvas );
    }
    console.log( canvas );
    this.setUpCanvas( canvas );
    console.log( canvas );
	
	this.loadingMode( canvas[0] );
	
    // Load resources
    var game = this;
    jQuery.getScript( "./beatblaster/js/loader.js", function( data, textStatus, jqxhr ) {
        console.log( "Loader: " + textStatus );
        if ( jqxhr.status !== 200 ) {
            // Load failed, abort
            console.log( "Couldn't load loader, status: " + textStatus );
            return;
        }
        // Preloader loaded, initialize
        this.loader = new Loader( game.loadComplete.bind( game ) );
    } );

}